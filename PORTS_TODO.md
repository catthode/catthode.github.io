# Catthode port follow-ups

Last reviewed: 2026-09-12

## Manual testing and submission

- [ ] **Ghostty GitHub port**
  - [x] Publish the native theme in a dedicated, Catthode-owned `catthode/ghostty` repository.
  - [x] Pass structural validation and Ghostty 1.3.1's native config validator.
  - [x] Apply the theme through the Nix-managed Ghostty installation and inspect the native ANSI palette, background, and text contrast.
  - [ ] Inspect cursor, selection, search, splits, and representative terminal applications.
  - [x] Capture a genuine screenshot using synthetic terminal content with no username, paths, command history, or other personal data.
  - [x] Keep distribution GitHub-first; there is no official Ghostty theme store and no upstream collection submission is planned.

- [ ] **Discord theme directories**
  - [x] Publish one portable CSS theme for both Vencord and BetterDiscord.
  - [x] Lint metadata and design-token selectors in CI.
  - [ ] Load the theme in a disposable Vencord or BetterDiscord client and inspect servers, channels, messages, settings, modals, calls, and profiles.
  - [ ] Remove the disposable client/profile data created for the check.
  - [ ] Submit the tested release to the applicable community theme directories.

- [ ] **Firefox Add-ons**
  - [x] Publish a static WebExtension theme with the stable ID `catthode@cattho.de`.
  - [x] Pass Mozilla's current `web-ext lint --warnings-as-errors` and produce an unsigned store ZIP in CI.
  - [x] Run the theme in a temporary Firefox profile and inspect horizontal and vertical tabs, toolbar fields, popups, sidebars, and new-tab UI.
  - [x] Capture a genuine Firefox listing screenshot from a smaller native-size window without resizing.
  - [x] Remove the temporary Firefox app, download, and working files; move the test-created profile, cache, and preference file to Trash for recoverability.
  - [x] Submit `v0.1.0` to Mozilla Add-ons; Mozilla approved the version.
  - [ ] Add the approved detailed description to the AMO product page.

- [ ] **Spicetify Marketplace**
  - [x] Publish the required `color.ini`, `user.css`, and marketplace metadata.
  - [x] Lint the CSS and validate every required color key in CI.
  - [x] Apply the theme through the Nix-managed Spicetify install and inspect Home cards, play-button hover states, playback controls, progress and volume indicators, the active-track equalizer, lyrics, and the mini-player in Spotify 1.2.99.317 with Spicetify 2.45.0 on macOS.
  - [x] Keep Catthode as the user's installed Spotify theme; no disposable Spotify or Spicetify installation was added.
  - [x] Replace the initial repository-native SVG with a genuine privacy-safe screenshot from public content, excluding the library rail, account avatar, device name, recommendations, and notifications.
  - [x] Push the final files, pass CI, and add the public repository topic `spicetify-themes` to publish it to Marketplace discovery.

- [ ] **Home Assistant / HACS**
  - [x] Publish one theme YAML in the HACS-required repository layout.
  - [x] Pass YAML assertions and the official HACS theme action.
  - [ ] Add the repository to a disposable Home Assistant instance and inspect desktop/mobile dashboards, cards, dialogs, controls, state colors, and editors.
  - [ ] Capture genuine screenshots and remove the disposable container, volume, and browser profile.
  - [ ] Create a personal fork of `hacs/default` and submit the released repository to the `theme` list; organization forks are not accepted.

- [ ] **JetBrains Marketplace**
  - [x] Package `v0.1.1` and pass JetBrains Plugin Verifier against IDEA Community 2025.2.1.
  - [x] Add the required 40 x 40 SVG plugin logo and change notes.
  - [ ] Sign in to JetBrains Marketplace and complete the vendor profile, developer agreement, EULA selection, public support contact, and EEA trader declaration.
  - [ ] Produce a genuine 1280 x 800 IDE screenshot. The disposable runner reached the JetBrains Community Edition agreement and stopped without accepting it.
  - [ ] Upload the verified JAR and screenshot for review.

- [x] **Zed Extension Gallery**
  - [x] Package `v0.1.1` with the compliant immutable ID `catthode-theme`.
  - [x] Validate the theme against Zed's live `v0.2.0` JSON schema.
  - [x] Record that Zed and its standard app/data paths were absent before testing.
  - [x] Run Zed 1.19.2 temporarily, install `v0.1.1` as a dev extension, and inspect the workbench, syntax, terminal ANSI palette, and diagnostics.
  - [x] Verify the seven collaboration cursor/selection color slots remain schema-valid; a live multi-user cursor session was not required for the registry draft.
  - [x] Capture a genuine native-size screenshot, remove the pointer with a localized pixel repair, and display the verified image in the repository README.
  - [x] Remove the temporary app, download, isolated user data, preferences, and logs created by the test.
  - [x] Submit the tested commit to `zed-industries/extensions`; PR [#7575](https://github.com/zed-industries/extensions/pull/7575) is open, mergeable, and passing package, Danger, and CLA checks.

## Open community follow-ups

- [ ] Configure and verify the `mail@cattho.de` mailbox used as the public support contact for theme-store listings.
- [ ] Delete the merged `jes-bz/wiki` fork through GitHub settings; the current CLI token does not have `delete_repo` scope.

## Recommended second wave

The order balances theme demand, size of the target ecosystem, store/discovery potential, and the ability to validate without a persistent local installation. Catppuccin repository stars are a directional theme-demand signal captured on 2026-09-06, not an estimate of active users.

1. [x] **Discord (Vencord and BetterDiscord)**
   - Signal: Catppuccin's Discord port has about 1,423 stars; Vencord and BetterDiscord have about 14,053 and 9,221 stars.
   - Deliverable: one CSS theme compatible with both common mod loaders where practical.
   - Validation: Stylelint plus a disposable browser-rendered Discord UI fixture; reserve a real client check for the manual queue.

2. [x] **Firefox**
   - Signal: Catppuccin's Firefox port has about 745 stars and Firefox provides a first-party Add-ons theme marketplace.
   - Deliverable: a static WebExtension theme with AMO metadata.
   - Validation: run Mozilla's `web-ext lint` and `web-ext build` in CI, then use a temporary Firefox runner profile for screenshots before AMO submission.

3. [x] **Spotify via Spicetify**
   - Signal: Catppuccin's Spicetify port has about 593 stars; Spicetify CLI has about 24,407 stars.
   - Deliverable: `color.ini`, CSS, and marketplace metadata.
   - Validation: static/config checks and a disposable Spicetify build first; queue a logged-in Spotify visual check before marketplace submission.

4. [x] **Home Assistant**
   - Signal: Catppuccin's Home Assistant port has about 497 stars; Home Assistant Core has about 90,286 stars.
   - Deliverable: a Home Assistant theme package suitable for HACS installation.
   - Validation: YAML/schema checks and a containerized Home Assistant instance with browser screenshots.

5. [x] **Starship**
   - Signal: Catppuccin's Starship port has about 462 stars; Starship has about 59,805 stars.
   - Deliverable: a Catthode palette and example prompt preset.
   - Validation: download the Starship binary only on CI runners and render representative prompts across several shells; no app store or local install is required.

## Deferred despite strong interest

- **KDE Plasma:** high theme interest, but a proper port spans multiple desktop components and needs a disposable Plasma VM plus significant visual QA.
- **Catppuccin userstyles:** popular but represents many websites rather than one bounded application, increasing maintenance substantially.
- **Kitty and other terminals:** prefer dedicated Catthode-owned repositories when there is a concrete app and validation path; do not submit Catthode to unrelated aggregate theme collections solely for discovery.
- **VS Code icons and cursor packs:** these require a complete original icon/art asset system rather than a palette port.
