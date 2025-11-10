const API_URL = "https://script.google.com/macros/s/AKfycbzozip_OJkNez7DAIpEnlkzzXCL6hHUBj0FaPsaIS6PzQlcaYXmEle_b8gTACARE_-_BA/exec";
const LOGIN_PASSWORD = "loveadmin123"; // change to whatever you want

let resultsData = [];

// ================= LOGIN =================
document.getElementById("loginBtn").onclick = () => {
  const enteredPass = document.getElementById("adminPass").value;
  if (enteredPass === LOGIN_PASSWORD) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    loadResults();
  } else {
    document.getElementById("errorMsg").innerText = "Incorrect Password";
  }
};

// ================= LOAD DATA =================
async function loadResults() {
  const response = await fetch(API_URL);
  resultsData = await response.json();
  renderTable(resultsData);
  drawCharts(resultsData);
}

function renderTable(data) {
  const table = document.getElementById("resultsTable");
  table.innerHTML = "";

  data.forEach(entry => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.datetime}</td>
      <td>${entry.hisName}</td>
      <td>${entry.herName}</td>
      <td>${entry.score}</td>
      <td><button onclick="deleteRow(${entry.row})">Delete</button></td>
    `;

    table.appendChild(row);
  });
}

// ================= DELETE ROW =================
async function deleteRow(rowNum) {
  await fetch(`${API_URL}?row=${rowNum}`, { method: "DELETE" });
  loadResults();
}

// ================= CLEAR ALL =================
document.getElementById("clearAll").onclick = async () => {
  await fetch(`${API_URL}?clear=true`, { method: "POST" });
  loadResults();
};

// ================= SEARCH =================
document.querySelector(".search-box").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = resultsData.filter(r =>
    r.hisName.toLowerCase().includes(val) ||
    r.herName.toLowerCase().includes(val)
  );
  renderTable(filtered);
});

// ================= SORT =================
function sortByDate(order) {
  resultsData.sort((a, b) => (order === "asc" ? new Date(a.datetime) - new Date(b.datetime) : new Date(b.datetime) - new Date(a.datetime)));
  renderTable(resultsData);
}

function sortByScore(order) {
  resultsData.sort((a, b) => (order === "asc" ? a.score - b.score : b.score - a.score));
  renderTable(resultsData);
}

// ================= CHARTS =================
function drawCharts(data) {
  const ctx1 = document.getElementById("scoreTrendChart");
  const ctx2 = document.getElementById("scoreFrequencyChart");

  const dates = data.map(d => d.datetime);
  const scores = data.map(d => Number(d.score));

  new Chart(ctx1, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{ data: scores }]
    }
  });

  const count = {};
  scores.forEach(s => count[s] = (count[s] || 0) + 1);

  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: Object.keys(count),
      datasets: [{ data: Object.values(count) }]
    }
  });
}
