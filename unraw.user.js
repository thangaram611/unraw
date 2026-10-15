// ==UserScript==
// @name         unraw
// @namespace    https://github.com/thangaram611/unraw
// @version      1.0.1
// @description  Un-raw your GitHub HTML files: one click renders any .html file on GitHub in your browser, privately. Works on private repositories you can read, on any branch. No servers, no tokens, nothing leaves your browser.
// @author       thangaram611
// @license      MIT
// @homepageURL  https://github.com/thangaram611/unraw
// @supportURL   https://github.com/thangaram611/unraw/issues
// @updateURL    https://raw.githubusercontent.com/thangaram611/unraw/main/unraw.user.js
// @downloadURL  https://raw.githubusercontent.com/thangaram611/unraw/main/unraw.user.js
// @match        https://github.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

/*
 * How it works, in three lines:
 *   1. On a file page like github.com/<owner>/<repo>/blob/<ref>/<path>.html, add a "Preview" button beside "Raw".
 *   2. On click, fetch the same path with /blob/ replaced by /raw/. GitHub answers with your own session,
 *      so private files you can read are returned (via a short-lived redirect to raw.githubusercontent.com).
 *   3. Put the text in a local blob: URL and open it in a new tab. The browser renders it like any page.
 *
 * Nothing is sent anywhere except to GitHub itself, exactly as if you had clicked "Raw".
 */
(() => {
  'use strict';

  const BUTTON_ID = 'unraw-preview-button';
  const HTML_FILE = /\.html?$/i;

  const isHtmlBlobPage = () =>
    /^\/[^/]+\/[^/]+\/blob\//.test(location.pathname) && HTML_FILE.test(location.pathname);

  const rawPath = () => location.pathname.replace('/blob/', '/raw/');

  const fileName = () => decodeURIComponent(location.pathname.split('/').pop() || 'preview.html');

  const open = async () => {
    // Open the tab synchronously, inside the click, so popup blockers allow it; navigate it once the file is here.
    const tab = window.open('', '_blank');
    if (!tab) return;
    tab.document.title = `unraw · ${fileName()}`;
    tab.document.body.innerHTML = '<p style="font:15px system-ui,sans-serif;padding:24px">unraw: fetching the file from GitHub…</p>';
    try {
      const response = await fetch(rawPath(), { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
      const html = await response.text();
      tab.location.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    } catch (error) {
      tab.document.body.innerHTML =
        `<p style="font:15px system-ui,sans-serif;padding:24px">unraw could not fetch this file (${String(error.message || error)}). ` +
        'Are you signed in to GitHub with access to this repository?</p>';
    }
  };

  const insertButton = () => {
    if (!isHtmlBlobPage()) {
      document.getElementById(BUTTON_ID)?.parentElement?.remove();
      return;
    }
    if (document.getElementById(BUTTON_ID)) return;

    const raw = document.querySelector('a[data-testid="raw-button"]');
    if (!raw) return;
    const group = raw.parentElement;
    if (!group || !group.parentElement) return;

    // Clone the Raw button's look so the new one matches GitHub's current styling.
    const wrapper = document.createElement('div');
    wrapper.className = group.className;
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.className = raw.className;
    // GitHub sizes its buttons through data attributes, not only classes; copy them so the
    // new button is the same height as Raw and sits flush in the group.
    for (const { name, value } of raw.attributes) {
      if (name.startsWith('data-') && name !== 'data-testid') button.setAttribute(name, value);
    }
    button.textContent = 'unraw';
    button.title = 'unraw: render this HTML file in a new tab (nothing leaves your browser)';
    button.addEventListener('click', event => {
      event.currentTarget.blur(); // no lingering focus ring after the new tab opens
      open();
    });
    wrapper.appendChild(button);
    group.parentElement.insertBefore(wrapper, group);
  };

  // GitHub navigates without full page loads, so watch for the file view being (re)rendered.
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      insertButton();
    });
  };

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', schedule);
  document.addEventListener('turbo:load', schedule);
  schedule();
})();
