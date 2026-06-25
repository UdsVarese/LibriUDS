# LibriUDS

Public database and online display for the 2026 UDS book-exchange campaign.


**How to Use:**
To remove an entry enter the data folder and open the books.json file. The books will be formatted one by one with all their different entries. To add an entry copy and paste a different entry and change the parameters (remeber to also assign the unique ID). JSON is extremely strict and doesnt accept any type of syntax errors, remeber to put a comma after an entry only if there is a new entry below it. Fail to do it (or add an unnecessary comma) and the whole data parsing fails. 
This is NOT practical but it is easy to build. 

**Example**

[
  {
    "id": 1,
    "title": "Title",
    "author": "Author",
    "year": 2067,
    "code": "ALG-CLRS-2009",
    "tags": ["liceo"],
    "description": "Daje"
  },

    {
    "id": 2,
    "title": "Title,
    "author": "Author",
    "code": "MDPC",
    "tags": ["liceo"],
    "description": "yey"
  }
  
]


**Architecture (prototype)**

- Data: `data/books.json` — small JSON file acting as the database. Each book has a `code` field that uniquely identifies it.
- Frontend: static site (`index.html`, `styles.css`, `scripts.js`) — fetches the JSON and performs client-side search and filtering.

This architecture is intentionally minimal so you can run it locally without a backend. For production you can replace `data/books.json` with an API backed by a real database (SQLite, PostgreSQL, etc.) and serve the frontend from a static host or the same server.

JSON entries structure:
- ID: Defining id value (for external handling purpose)
- Title: Precise book title
- Author
- Year: for different year editions
- Code: ISBN code
- Tags: used as an extra query for the search algorythm
- Description: additional details


Limitations:

- The current implementation loads the full JSON dataset into the browser; for very large collections you should implement a server-side search API.
