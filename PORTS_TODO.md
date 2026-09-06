# Catthode port follow-ups

Last reviewed: 2026-09-06

## Manual testing and submission

- [ ] **Discord theme directories**
  - [x] Publish one portable CSS theme for both Vencord and BetterDiscord.
  - [x] Lint metadata and design-token selectors in CI.
  - [ ] Load the theme in a disposable Vencord or BetterDiscord client and inspect servers, channels, messages, settings, modals, calls, and profiles.
  - [ ] Remove the disposable client/profile data created for the check.
  - [ ] Submit the tested release to the applicable community theme directories.

- [ ] **Firefox Add-ons**
  - [x] Publish a static WebExtension theme with the stable ID `catthode@cattho.de`.
  - [x] Pass Mozilla's current `web-ext lint --warnings-as-errors` and produce an unsigned store ZIP in CI.
  - [ ] Run the theme in a temporary Firefox profile and inspect horizontal tabs, vertical tabs, toolbar fields, popups, sidebars, and new-tab UI.
  - [ ] Capture genuine Firefox listing screenshots, then remove the temporary profile.
  - [ ] Sign in to Mozilla Add-ons, supply API credentials, and submit the package for signing/review.

- [ ] **Spicetify Marketplace**
  - [x] Publish the required `color.ini`, `user.css`, and marketplace metadata.
  - [x] Lint the CSS and validate every required color key in CI.
  - [ ] Apply the theme in a disposable Spicetify/Spotify setup with a test account and inspect Home, Search, Library, playlists, Now Playing, queue, and dialogs.
  - [ ] Restore Spotify and remove only the disposable Spicetify data created for the check.
  - [ ] Submit the tested theme to the Spicetify Marketplace catalog.

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

- [ ] **Zed Extension Gallery**
  - [x] Package `v0.1.1` with the compliant immutable ID `catthode-theme`.
  - [x] Validate the theme against Zed's live `v0.2.0` JSON schema.
  - [ ] Record whether Zed or its data directory already exists before testing.
  - [ ] Run Zed temporarily, install the repository as a dev extension, and inspect the workbench, syntax, terminal, diagnostics, and collaboration colors.
  - [ ] Remove only the app and data created by the temporary test.
  - [ ] Submit the tested commit to `zed-industries/extensions`.

## Open community follow-ups

- [ ] Monitor `mbadolato/iTerm2-Color-Schemes#741`; delete the `jes-bz/iTerm2-Color-Schemes` fork after merge.
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
- **Kitty and other terminals:** the pending iTerm2 Color Schemes contribution already generates Catthode for Kitty, WezTerm, Ghostty, Konsole, and many other terminal formats.
- **VS Code icons and cursor packs:** these require a complete original icon/art asset system rather than a palette port.
