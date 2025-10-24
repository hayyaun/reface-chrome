# Contributing to Reface Web Extension

Follow these steps:

- Add your patch files into `service/patches` directory.
- List your plugin by adding a new field in `shared/patches.ts`.
- Please confirm that the key matches your filename.
- Hover on each field tp read the related docs.
- You can specify css files mapped to each url pathname.
- If config keyvals are defined, they'll be accessible via `window.__rc_config` in your script. (if enabled)
- To customize logo or profile modal, shown in popup, navigate to `src/profiles/index.ts`.
- IndexedDB is also available in `shared/store/db.ts` [update with caution].
- For message support, ticket an issue.

> Patches with script file take longer to review, please use css format for themes only!

# Maintainers

- `background.js` should NOT have imports after build.
- Patch content scripts should NOT have imports after build.
- Minimize usage of global polyfill definition as much as possible.
