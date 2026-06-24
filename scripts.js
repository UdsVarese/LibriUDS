let books = [];

const $ = id => document.getElementById(id);

function getParams() {
  const p = new URLSearchParams(location.search);
  return { q: p.get('q') || '', tag: p.get('tag') || '', code: p.get('code') || '' };
}

async function loadBooks() {
  try {
    const res = await fetch('data/books.json');
    books = await res.json();
    populateTagFilter();

    // If the URL contains params, apply them so links from GitHub Pages work
    const params = getParams();
    if (params.code) {
      // search by exact code
      $('q').value = params.code;
      searchBooks();
      // highlight after render
      setTimeout(() => highlightByCode(params.code), 100);
      return;
    }

    if (params.q) $('q').value = params.q;
    if (params.tag) $('tag-filter').value = params.tag;

    if (params.q || params.tag) searchBooks();
    else renderResults(books);
  } catch (err) {
    document.querySelector('#results').innerHTML = `<div class="error">Failed to load books: ${err}</div>`;
  }
}

function populateTagFilter() {
  const tags = new Set();
  books.forEach(b => (b.tags || []).forEach(t => tags.add(t)));
  const select = $('tag-filter');
  Array.from(tags).sort().forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}

function renderResults(list) {
  const container = $('results');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<p class="empty">No results found.</p>';
    $('count').textContent = '0 results';
    return;
  }
  $('count').textContent = `${list.length} result${list.length !== 1 ? 's' : ''}`;

  list.forEach(b => {
    const card = document.createElement('article');
    card.className = 'card';

    const title = document.createElement('h2');
    title.textContent = b.title;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${b.author} — ${b.year}`;

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = b.description || '';

    const tags = document.createElement('div');
    tags.className = 'tags';
    (b.tags || []).forEach(t => {
      const tspan = document.createElement('span');
      tspan.className = 'tag';
      tspan.textContent = t;
      tags.appendChild(tspan);
    });

    const codeRow = document.createElement('div');
    codeRow.className = 'code-row';
    const codeLabel = document.createElement('code');
    codeLabel.className = 'code';
    codeLabel.textContent = b.code || '';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy';
    copyBtn.textContent = 'Copy code';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(b.code || '')
        .then(() => { copyBtn.textContent = 'Copied!'; setTimeout(()=>copyBtn.textContent='Copy code',1200); })
        .catch(()=>{ copyBtn.textContent='Failed'; setTimeout(()=>copyBtn.textContent='Copy code',1200); });
    });

    codeRow.appendChild(codeLabel);
    codeRow.appendChild(copyBtn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(desc);
    card.appendChild(tags);
    card.appendChild(codeRow);

    container.appendChild(card);
  });
}

function highlightByCode(code) {
  const list = Array.from(document.querySelectorAll('.code'));
  const el = list.find(x => x.textContent === code);
  if (!el) return;
  const card = el.closest('.card');
  if (!card) return;
  card.classList.add('highlight');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function searchBooks() {
  const q = $('q').value.trim();
  const ql = q.toLowerCase();
  const tag = $('tag-filter').value;
  let filtered = books.filter(b => {
    if (tag && !(b.tags || []).includes(tag)) return false;
    if (!ql) return true;
    return [b.title, b.author, b.code, b.description]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(ql));
  });
  renderResults(filtered);

  // update URL so results can be shared on GitHub Pages
  const sp = new URLSearchParams();
  if (q) sp.set('q', q);
  if (tag) sp.set('tag', tag);
  const url = sp.toString() ? `?${sp.toString()}` : location.pathname;
  history.replaceState(null, '', url);
}

function debounce(fn, ms=200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), ms); };
}

document.addEventListener('DOMContentLoaded', () => {
  $('q').addEventListener('input', debounce(searchBooks, 150));
  $('tag-filter').addEventListener('change', searchBooks);
  loadBooks();
});
