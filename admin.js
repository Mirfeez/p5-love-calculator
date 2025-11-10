const API_URL = "https://script.google.com/macros/s/AKfycbzozip_OJkNez7DAIpEnlkzzXCL6hHUBj0FaPsaIS6PzQlcaYXmEle_b8gTACARE_-_BA/exec";
const LOGIN_PASSWORD = "312fmmn"; // your password

let resultsData = [];

// Login
document.getElementById("loginBtn").onclick = () => {
  if (document.getElementById("adminPass").value === LOGIN_PASSWORD) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    loadResults();
  } else {
    document.getElementById("errorMsg").innerText = "❌ Wrong password";
  }
};

// Load results
async function loadResults() {
  const response = await fetch(API_URL);
  resultsData = await response.json();
  renderTable(resultsData);
  drawCharts(resultsData);
}

function renderTable(list) {
  const table = document.getElementById("resultsTable");
  table.innerHTML = "";

  list.forEach(entry => {
    table.innerHTML += `
      <tr>
        <td>${entry.datetime}</td>
        <td>${entry.hisName}</td>
        <td>${entry.herName}</td>
        <td>${entry.score}</td>
        <td><button onclick="deleteRow(${entry.row})">Delete</button></td>
      </tr>
    `;
  });
}

// Delete a row
async function deleteRow(row) {
  await fetch(`${API_URL}?row=${row}`, { method: "DELETE" });
  loadResults();
}

// Clear all data
document.getElementById("clearAll").onclick = async () => {
  await fetch(`${API_URL}?clear=true`, { method: "POST" });
  loadResults();
};

// Search
document.querySelector(".search-box").oninput = (e) => {
  const search = e.target.value.toLowerCase();
  const filtered = resultsData.filter(r =>
    r.hisName.toLowerCase().includes(search) ||
    r.herName.toLowerCase().includes(search)
  );
  renderTable(filtered);
};

// Sorting
function sortByDate(order) {
  resultsData.sort((a, b) =>
    order === "asc"
      ? new Date(a.datetime) - new Date(b.datetime)
      : new Date(b.datetime) - new Date(a.datetime)
  );
  renderTable(resultsData);
}

function sortByScore(order) {
  resultsData.sort((a, b) =>
    order === "asc" ? a.score - b.score : b.score - a.score
  );
  renderTable(resultsData);
}

// Charts
function drawCharts(data) {
  const dates = data.map(d => d.datetime);
  const scores = data.map(d => Number(d.score));

  new Chart(document.getElementById("scoreTrendChart"), {
    type: "line",
    data: { labels: dates, datasets: [{ data: scores }] }
  });

  const frequency = {};
  scores.forEach(s => frequency[s] = (frequency[s] || 0) + 1);

  new Chart(document.getElementById("scoreFrequencyChart"), {
    type: "bar",
    data: { labels: Object.keys(frequency), datasets: [{ data: Object.values(frequency) }] }
  });
}
