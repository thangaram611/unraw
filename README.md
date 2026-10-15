# unraw

**Un-raw your GitHub HTML files.** One click renders any `.html` file on GitHub in your browser, privately. Works on private repositories you can read, on any branch. No servers, no tokens, nothing leaves your browser.

GitHub shows HTML files as source. The usual workarounds either only work for public repositories, or route your GitHub token and your private files through someone else's server. unraw does neither: it uses the GitHub session you already have, the same way the **Raw** button does, and renders the file locally.

## Install

1. Install a userscript manager, once:
   - Chrome, Edge, Brave, Opera: [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
   - Firefox: [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
   - Safari (Mac, iPhone, iPad): [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
2. Install unraw from either source:
   - Greasy Fork: https://greasyfork.org/scripts/600316-unraw (updates handled by Greasy Fork)
   - GitHub: https://raw.githubusercontent.com/thangaram611/unraw/main/unraw.user.js (updates via `@updateURL`)

   Your manager opens an install dialog showing the full source. Read it; it is about 80 lines.

## Use

Open any `.html` file on GitHub. A **Preview** button appears next to **Raw**. Click it: the rendered page opens in a new tab. Works on every branch, commit and tag, and in every repository your account can read.

## How it works

1. On a file page (`github.com/<owner>/<repo>/blob/<ref>/<path>.html`) the script adds the button.
2. On click it fetches the same path with `/blob/` replaced by `/raw/`. GitHub serves it with your own session; for private files that is a short-lived redirect to `raw.githubusercontent.com`.
3. The text goes into a local `blob:` URL, which the browser renders like any page.

## Privacy

- The only network requests are the ones GitHub itself makes for the **Raw** button.
- No token is typed, stored or sent. No third-party server is involved. Nothing is logged.
- The rendered page lives at a `blob:` URL in your browser; it has no cookies and no access to GitHub.

## Limitations

- Pages that reference **relative** files (`./style.css`, `img/x.png`) render without them, because those paths do not exist at a `blob:` URL. Self-contained pages (inline CSS, inline SVG, data URLs, absolute `https://` links) render completely. Inlining is the right habit for documentation you want to read from GitHub anyway.
- Inline scripts run inside the `blob:` page, isolated from GitHub. Treat a preview the way you would treat opening the file from a download.
- GitHub changes its page layout now and then. If the button disappears, the fetch still works; open an issue.

## Alternatives, honestly

- [GitHub Html Preview](https://github.com/dohyeon5626/github-html-preview-extension) (Chrome extension): for private repositories it sends your GitHub token to the author's server and renders the page on the author's domain.
- [GitHub Preview (UserScript)](https://greasyfork.org/scripts/577730) by PRO-2684 (GPL-3.0): similar idea, resolves the raw redirect with a HEAD request and previews HTML and media.
- [htmlpreview](https://htmlpreview.github.io/): public repositories only.

## License

[MIT](LICENSE)
