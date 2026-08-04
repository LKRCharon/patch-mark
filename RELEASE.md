# Release checklist

Every patch-mark release follows this sequence. Tick each step — the one most
often forgotten is #12 (GitHub Release), which is how Releases falls behind
npm/tags.

## One-time setup (already done)

- npm Trusted Publishing configured via
  `npm trust github --file publish.yml --repository LKRCharon/patch-mark --allow-publish -y`
  (requires npm >= 11.15.0; 11.18+ requires `--allow-publish`; run `npm login`
  first and complete the browser 2FA prompt)
- `.github/workflows/publish.yml` uses `id-token: write` + `npm publish --provenance`,
  no `NPM_TOKEN` secret needed

## Per-release steps

| # | Step | Command / action | Verify |
|---|------|------------------|--------|
| 1 | Code done | `npm run typecheck && npm test && npm run build && npm run docs:build` | green |
| 2 | Bump version | `package.json` `version` | matches CHANGELOG |
| 3 | Update CHANGELOG | new `## [x.y.z] - YYYY-MM-DD` section | Added / Changed / Fixed |
| 4 | Artifact + pack check | Stage the release files, then run `npm run build && git diff --exit-code -- dist/patch-mark.js && npm pack --dry-run` | rebuild leaves the staged bundle unchanged; files + size sane |
| 5 | Commit | `release: x.y.z` | |
| 6 | Push main | `git push` | remote main advances |
| 7 | — | trusted publishing is one-time, skip | |
| 8 | Trigger workflow | `gh workflow run publish.yml` | run starts |
| 9 | Watch workflow | `gh run watch <id> --exit-status` | success |
| 10 | Verify npm | `npm view patch-mark version` | equals new version |
| 11 | Tag | `git tag vX.Y.Z && git push --tags` | remote tag exists |
| 12 | GitHub Release | `gh release create vX.Y.Z --latest --notes "<CHANGELOG section>"` | Releases page shows it |
| 13 | README badge | npm version badge auto-reads latest | automatic |

## Extracting release notes from CHANGELOG

```bash
NOTES=$(awk '/^## \[0\.5\.0\]/{f=1} f{print} f&&/^## \[0\.3\.0\]/{exit}' CHANGELOG.md)
gh release create vX.Y.Z --latest --notes "$NOTES"
```

Swap the version numbers for the release at hand (current version, previous version).

## Automating #12

`publish.yml` can create the Release itself after a successful publish, so #12
stops being manual. Either append a `gh release create` step to the workflow,
or switch the trigger to tag push and publish + release in one run. Not done
yet — add when the manual step becomes tedious.

## Historical gaps

- v0.1.0: on npm, no tag, no Release
- v0.2.0: tag exists, no Release

These predate this checklist. Backfill with `gh release create <tag>` if a
complete release history matters.
