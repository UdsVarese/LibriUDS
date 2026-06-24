# LibriUDS
# LibriUDS

Public database and online display for the 2026 UDS book-exchange campaign.

**Architecture (simple, local prototype)**

- Data: `data/books.json` — small JSON file acting as the database. Each book has a `code` field that uniquely identifies it.
- Frontend: static site (`index.html`, `styles.css`, `scripts.js`) — fetches the JSON and performs client-side search and filtering.

This architecture is intentionally minimal so you can run it locally without a backend. For production you can replace `data/books.json` with an API backed by a real database (SQLite, PostgreSQL, etc.) and serve the frontend from a static host or the same server.

**Files added/updated**

- `index.html` — search UI
- `styles.css` — styles for UI and results
- `scripts.js` — client logic: load JSON, search, render, copy code
- `data/books.json` — example dataset with sample entries

**Run locally (quick)**

1. Start a simple static server in the project folder (recommended to avoid browser file restrictions):

```powershell
python -m http.server 8000
```

2. Open `http://localhost:8000` in your browser.

**Next steps / recommended improvements**

- Replace `data/books.json` with a small API (Node/Express + SQLite) for dynamic updates.
- Add pagination or server-side search for large datasets.
- Add authentication and an admin UI to add/edit book entries.

If you want, I can scaffold a minimal Node API (Express) with SQLite and endpoints for listing/searching/adding books — tell me if you want that next.

**Deploy to GitHub Pages**

This project is a static site and is compatible with GitHub Pages. To publish:

1. Push this repository to GitHub (if not already pushed).
2. In the repository on GitHub go to `Settings` → `Pages` and set the source branch to `main` and folder to `/ (root)`.
3. Save — GitHub will publish the site at `https://<your-username>.github.io/<repo>/` (project page) within a minute or two.

Notes about GitHub Pages usage:

- All data is loaded from `data/books.json` using a relative path, so the site works when hosted as a project page.
- Searches and tag selections are shareable: use URL parameters `q`, `tag`, or `code`.
	- Examples:
		- Search query: `https://<your-username>.github.io/<repo>/?q=javascript`
		- Tag filter: `https://<your-username>.github.io/<repo>/?tag=programming`
		- Direct to a book by code: `https://<your-username>.github.io/<repo>/?code=ALG-CLRS-2009`.

Limitations:

- The current implementation loads the full JSON dataset into the browser; for very large collections you should implement a server-side search API.

If you'd like, I can scaffold an Express+SQLite backend and update the frontend to use it; tell me whether you prefer hosting the API on GitHub (not supported) or a separate server.
