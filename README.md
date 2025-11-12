<!--
  README for the NewsWale project.
  This file explains how the project is organized and the code flow so you can quickly follow and modify the app.
-->

# NewsWale

Short: A simple static news site built with HTML, CSS and JavaScript that fetches articles from NewsAPI and displays them as cards.

> Note (in Hindi): Ye README aapko code ka flow samajhne mein madad karega — kaise data fetch hota hai, templates kaise fill kiye jaate hain, aur styling kahan change karni hai.

---

## Quick start

1. Open PowerShell and change to the project folder (the folder that contains `index.html`):

```powershell
cd c:\Users\ashis\Downloads\NewsWebsite-main\NewsWebsite-main
python -m http.server 8000
```

2. Open your browser and go to: `http://localhost:8000`

3. To stop the server: press `Ctrl+C` in the terminal or run `Get-Process -Name python | Stop-Process`.

---

## File structure (important files)

- `index.html` - page structure and the news-card template (`<template id="template-news-card">`).
- `styles.css` - all styling; theme and brand color live here.
- `script.js` - main logic: fetch, render, and event handlers.
- `images/` - local images (logo, etc.).

---

## Code flow (read this to understand the app)

1. window load
	- `window.addEventListener('load', () => fetchNews('Technology'))` (in `script.js`) triggers the first fetch.

2. fetchNews(query)
	- Builds the request URL using `url = "https://newsapi.org/v2/everything?q="` and the `API_KEY` found in `script.js`.
	- Calls `fetch(...)`, awaits JSON, then calls `bindData(data.articles)`.

3. bindData(articles)
	- Gets the card container element `#cardscontainer` and the `<template id="template-news-card">`.
	- Clears the container and for each article that has `urlToImage`:
	  - clones the template, calls `fillDataInCard(clone, article)`, and appends to the container.

4. fillDataInCard(cardClone, article)
	- Finds elements inside the cloned template: `#news-img`, `#news-title`, `#news-source`, `#news-desc`.
	- Sets `newsImg.src`, `newsTitle.innerHTML`, `newsDesc.innerHTML`.
	- Formats `publishedAt` into a readable date and sets `newsSource.innerHTML = 'NewsWale · <date>'` (the app was changed to always show the NewsWale brand).
	- Adds click listener on the card to open the original article (`window.open(article.url, '_blank')`).

5. Navigation and search
	- `onNavItemClick(id)` calls `fetchNews(id)` and updates nav active state.
	- Search input + button call `fetchNews(query)` when user searches.

---

## Important implementation notes

- Branding: The HTML/CSS were updated to show the `NewsWale` text in the navbar and script.js forces `newsSource` to display `NewsWale · <date>` for each card.
- Theme: The CSS was updated to a black & white base and the `.company-name` color was changed to deep orange (`#FF8C00`). You can change the color in `styles.css` under `.company-name`.
- Logo: The original logo image (`images/logo.png`) was removed from the navbar and replaced with text branding. If you want to restore an image logo, put `logo.png` back in `images/` and update `index.html`.

## Where to change things quickly

- API key: `script.js` near the top — replace the value of `API_KEY`. Be aware of NewsAPI rate limits and don't commit private keys to public repos.
- Brand color: `styles.css` → `.company-name`.
- Change source text behaviour: `script.js` → in `fillDataInCard` modify `newsSource.innerHTML` if you want the original source name (`article.source.name`) instead of `NewsWale`.

## Troubleshooting

- If the page seems to show old content: do a hard refresh (Ctrl+F5) or clear browser cache.
- Do not open `index.html` directly with `file://` — the API calls may be blocked; always use a local server (`python -m http.server` or similar).
- If the server fails to start because the port is in use, pick another port: `python -m http.server 3000`.

## Security & next steps

- Move the API key off the client for production (use a small server that proxies requests, or an environment variable).
- Add basic error handling around `fetch` (currently the app assumes success).

---

If you want, I can also add:
- a small CONTRIBUTING.md with instructions for editing the brand and theme,
- a simple server proxy (Node/Python) to hide the API key,
- or a minimal test that checks `fetchNews` returns articles.

Happy hacking — agar aap chaho toh main aur improvements add kar deta hoon.

