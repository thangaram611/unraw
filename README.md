# unraw

**Un-raw your GitHub HTML files.** One click renders any `.html` file on GitHub in your browser, privately. Works on private repositories you can read, on any branch. No servers, no tokens, nothing leaves your browser.

Install page: **https://thangaram611.github.io/unraw/**

## Why unraw exists

GitHub shows HTML files as source. Every existing way around that either works only on public repositories, or makes your private file pass through a third party:

- The **Github Html Preview** Chrome extension sends your GitHub token (a personal access token, or an OAuth grant with full `repo` scope) to the author's server, which fetches your file and renders it on the author's domain.
- The **GitHub Preview** userscript resolves the short-lived tokenised link GitHub issues for a private file and passes that link, as a URL parameter, to the author's website, which then loads your file. The link to your private file ends up in that site's address bar, history and hosting logs.
- **htmlpreview** and its forks proxy the raw file and cannot read private repositories at all.

unraw was written from scratch with one rule: **the file may not leave your browser.** It does the same thing the **Raw** button does, with your own GitHub session, and renders the result locally from a `blob:` URL. There is no server to trust, no token to paste, no account to create, and no site other than github.com in the whole path. It is about 80 lines; read them in the install dialog.

| | unraw | Github Html Preview (extension) | GitHub Preview (userscript) | htmlpreview |
| --- | --- | --- | --- | --- |
| Private repositories | Yes, with your existing GitHub login | Yes, with your token | Yes | No |
| Where the page renders | Your browser, local `blob:` URL | Author's domain | Author's website | htmlpreview.github.io |
| What leaves your browser | Nothing beyond GitHub's own Raw request | Your token and your file, via the author's server | A tokenised link to your private file, to the author's site | The public file |
| Account or token needed | None | Token or OAuth grant | None | None |
| Works with nothing installed | Yes (bookmarklet) | No | No | No |
| Licence | MIT | MIT | GPL-3.0 | Public domain |

The other tools are honest projects and some predate this one; the idea of a button beside **Raw** is theirs. The privacy design is the reason unraw exists, and anything that would need a server or a token will not be added to it.

## Install

Three ways, pick one:

1. **Bookmarklet, nothing to install.** Go to **https://thangaram611.github.io/unraw/** and drag the button to your bookmarks bar. Works in Chrome, Edge, Brave, Firefox, Safari and Opera. (A bookmarklet is a bookmark that holds a tiny program; the page shows the code and a copy fallback for phones.)
2. **Userscript**, for an **unraw** button on the page itself. Install a manager once (Chrome, Edge, Brave, Opera, Firefox: [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/); Safari on Mac, iPhone, iPad: [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)), then install from either source:
   - Greasy Fork: https://greasyfork.org/scripts/600316-unraw (updates handled by Greasy Fork)
   - GitHub: https://raw.githubusercontent.com/thangaram611/unraw/main/unraw.user.js (updates via `@updateURL`)

   Your manager opens an install dialog showing the full source. Read it; it is about 80 lines.
3. **Browser extension**, one-click from the Chrome Web Store, Firefox Add-ons and Edge Add-ons: coming.

## Use

Open any `.html` file on GitHub. With the userscript, an **unraw** button appears next to **Raw**; with the bookmarklet, click the bookmark. Either way the rendered page opens in a new tab. Works on every branch, commit and tag, and in every repository your account can read.

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

## Credits

- [Github Html Preview](https://github.com/dohyeon5626/github-html-preview-extension) by dohyeon5626 (MIT)
- [GitHub Preview (UserScript)](https://greasyfork.org/scripts/577730) by PRO-2684 (GPL-3.0)
- [htmlpreview](https://htmlpreview.github.io/)

## License

[MIT](LICENSE)
