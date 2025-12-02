// Admin JS: reads/writes from Firebase Realtime Database and renders table
// Make sure admin.html includes compat SDKs and firebase-init.js before this script.

const resultsTable = document.getElementById('resultsTable');
const searchBox = document.querySelector('.search-box');
let allResults = []; // array of { key, name1, name2, score, timestamp }

function formatTimestamp(ts) {
  try { return new Date(ts).toLocaleString(); } catch (e) { return ts; }
}

function listenForResults() {
  if (window.database && typeof window.database.ref === 'function') {
    // listen for realtime updates
    const ref = window.database.ref('love-calculator-results');
    ref.on('value', (snapshot) => {
      const results = [];
      snapshot.forEach(child => {
        const val = child.val();
        results.push({ key: child.key, name1: val.name1 || val.hisName || val.name_1 || '', name2: val.name2 || val.herName || val.name_2 || '', score: val.score, timestamp: val.timestamp || val.datetime || new Date().toISOString() });
      });
      // sort newest first by default
      allResults = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      displayResults(allResults);
    });
  } else {
    // fallback: read localStorage (useful for testing or when firebase not configured)
    const results = JSON.parse(localStorage.getItem('loveCalculatorResults') || '[]');
    allResults = results.map(r => ({ key: r.timestamp, name1: r.name1 || r.hisName, name2: r.name2 || r.herName, score: r.score, timestamp: r.timestamp }));
    displayResults(allResults);
  }
}

function displayResults(results) {
  resultsTable.innerHTML = '';
  results.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatTimestamp(r.timestamp)}</td>
      <td>${escapeHtml(r.name1)}</td>
      <td>${escapeHtml(r.name2)}</td>
      <td>${r.score}%</td>
      <td><button class="delete-btn" data-key="${r.key}">Delete</button></td>
    `;
    resultsTable.appendChild(tr);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// delete by database key (or fallback by timestamp key)
async function deleteResultByKey(key) {
  if (!confirm('Are you sure you want to delete this entry?')) return;
  if (window.database && typeof window.database.ref === 'function') {
    try {
      await window.database.ref('love-calculator-results/' + key).remove();
      // firebase on('value') will update UI
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  } else {
    // fallback: remove from localStorage by timestamp key
    let results = JSON.parse(localStorage.getItem('loveCalculatorResults') || '[]');
    results = results.filter(r => r.timestamp !== key);
    localStorage.setItem('loveCalculatorResults', JSON.stringify(results));
    allResults = results.map(r => ({ key: r.timestamp, name1: r.name1, name2: r.name2, score: r.score, timestamp: r.timestamp }));
    displayResults(allResults);
  }
}

// wire up delegated click listener for delete buttons
resultsTable.addEventListener('click', (e) => {
  const btn = e.target.closest('button.delete-btn');
  if (btn) {
    const key = btn.getAttribute('data-key');
    if (key) deleteResultByKey(key);
  }
});

// search
searchBox.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allResults.filter(r => (r.name1 || '').toLowerCase().includes(term) || (r.name2 || '').toLowerCase().includes(term));
  displayResults(filtered);
});

// sorting helpers (exposed to global so buttons in HTML can call them)
function sortByDate(order) {
  const sorted = [...allResults].sort((a, b) => order === 'desc' ? new Date(b.timestamp) - new Date(a.timestamp) : new Date(a.timestamp) - new Date(b.timestamp));
  displayResults(sorted);
}

function sortByScore(order) {
  const sorted = [...allResults].sort((a, b) => order === 'desc' ? b.score - a.score : a.score - b.score);
  displayResults(sorted);
}

// expose to global for buttons
window.sortByDate = sortByDate;
window.sortByScore = sortByScore;
window.deleteResultByKey = deleteResultByKey;

// start listening when script loads
listenForResults();
