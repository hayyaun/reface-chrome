# Contributing to Reface Web Extension

Follow these steps:

- Add your patch files into `service/patches` directory.
- List your patch by adding a new field in `shared/patches.ts`.
- Please confirm that the key matches your filename.
- You can specify css files mapped to each url pathname.
  - CSS class name convention would be as `.reface--[patch-key]-[class-name]` to prevent conflicts.
  - However, you can use any classname for theme category to override existing classes on a website with `!importnat`.
- If config keyvals are defined, they'll be accessible via `window.__rc_config` in your script. (if enabled)
  - You can change the value of a config item directly by sending `"update-config"` message to background.
  - Be sure not to work with other patch configs than yours.
- To customize logo or profile modal, shown in popup, navigate to `src/profiles/index.ts`.
- IndexedDB is also available in `shared/store/db.ts` [update with caution].
- For message support, ticket an issue.

> Patches with script file take longer to review, please use css format for themes only!
