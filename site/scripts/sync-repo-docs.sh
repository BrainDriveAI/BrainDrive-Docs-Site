#!/usr/bin/env bash
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required. Install with: brew install jq"
  exit 1
fi

ORG="BrainDriveAI"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/docs/repos"

mkdir -p "$OUT_DIR"
find "$OUT_DIR" -mindepth 1 ! -name "_intro.md" -exec rm -rf {} + 2>/dev/null || true

page=1
while :; do
  resp=$(curl -sS \
    -H "Accept: application/vnd.github+json" \
    ${GITHUB_TOKEN:+-H "Authorization: Bearer $GITHUB_TOKEN"} \
    "https://api.github.com/orgs/$ORG/repos?per_page=100&page=$page")

  names=$(echo "$resp" | jq -r '.[] | select(.archived==false) | .name // empty')
  [[ -z "$names" ]] && break

  while IFS= read -r repo; do
    [[ -z "$repo" || "$repo" == "BrainDrive-Docs" ]] && continue
    echo "=== $repo ==="

    meta=$(curl -sS \
      -H "Accept: application/vnd.github+json" \
      ${GITHUB_TOKEN:+-H "Authorization: Bearer $GITHUB_TOKEN"} \
      "https://api.github.com/repos/$ORG/$repo")
    default_branch=$(echo "$meta" | jq -r '.default_branch // "main"')
    repo_dir="$OUT_DIR/$repo"
    mkdir -p "$repo_dir"

    cat > "$repo_dir/_category_.json" <<EOF
{
  "label": "$repo",
  "link": { "type": "generated-index", "description": "Docs imported from $repo" },
  "collapsed": true
}
EOF

    raw="https://raw.githubusercontent.com/$ORG/$repo/$default_branch/"

    readme_url=$(curl -sS \
      -H "Accept: application/vnd.github+json" \
      ${GITHUB_TOKEN:+-H "Authorization: Bearer $GITHUB_TOKEN"} \
      "https://api.github.com/repos/$ORG/$repo/readme" | jq -r '.download_url // empty')

    if [[ -n "$readme_url" ]]; then
      echo "• README"
      content=$(curl -sSL "$readme_url")
      content=$(printf "%s" "$content" \
        | sed -E "s#\\]\\(\\./#](${raw}#g" \
        | sed -E "s#\\]\\(images/#](${raw}images/#g" \
        | sed -E "s#\\]\\(assets/#](${raw}assets/#g" \
        | sed -E "s#\\]\\(img/#](${raw}img/#g" \
        | sed -E "s#\\]\\(media/#](${raw}media/#g" )
      cat > "$repo_dir/README.md" <<EOF
---
title: $repo
sidebar_label: README
custom_edit_url: https://github.com/$ORG/$repo/edit/$default_branch/README.md
---

$content
EOF
    fi

    tree=$(curl -sS \
      -H "Accept: application/vnd.github+json" \
      ${GITHUB_TOKEN:+-H "Authorization: Bearer $GITHUB_TOKEN"} \
      "https://api.github.com/repos/$ORG/$repo/git/trees/$default_branch?recursive=1")

    paths=$(echo "$tree" | jq -r '.tree[]? | select(.type=="blob") | .path' | grep -E '^docs/.*\.(md|mdx)$' || true)
    if [[ -n "$paths" ]]; then
      echo "• docs/ files"
      while IFS= read -r path; do
        dest="$repo_dir/${path#docs/}"
        mkdir -p "$(dirname "$dest")"
        file_url="${raw}${path}"
        body=$(curl -sSL "$file_url")
        cleaned=$(awk 'NR==1 && $0=="---"{inY=1; next} inY && $0=="---"{inY=0; next} !inY {print}' <<< "$body")
        cleaned=$(printf "%s" "$cleaned" \
          | sed -E "s#\\]\\(\\./#](${raw}#g" \
          | sed -E "s#\\]\\(images/#](${raw}images/#g" \
          | sed -E "s#\\]\\(assets/#](${raw}assets/#g" \
          | sed -E "s#\\]\\(img/#](${raw}img/#g" \
          | sed -E "s#\\]\\(media/#](${raw}media/#g" )
        cat > "$dest" <<EOF
---
custom_edit_url: https://github.com/$ORG/$repo/edit/$default_branch/$path
---

$cleaned
EOF
      done <<< "$paths"
    fi
  done <<< "$names"

  page=$((page+1))
done

echo "✅ Sync complete → $OUT_DIR"
