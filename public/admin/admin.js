const API_URL = "http://localhost:5000/api/results";
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
    const response = await fetch('http://localhost:5000/api/data');
    const data = await response.json();
    resultsData = data; // <-- This line is required!
    renderTable(data);
}

function renderTable(list) {
  console.log(list);
  
  const table = document.getElementById("resultsTable");
  table.innerHTML = "";
  list.forEach(entry => {
    table.innerHTML += `
      <tr>
        <td>${entry.datetime}</td>
        <td>${entry.hisName}</td>
        <td>${entry.herName}</td>
        <td>${entry.score}</td>
        <td><button onclick="deleteRow(${entry.id})">Delete</button></td>
      </tr>
    `;
  });
}

// Delete a row
async function deleteRow(id) {
    await fetch(`http://localhost:5000/api/results/${id}`, { method: "DELETE" });
    loadResults();
}

// Clear all data
document.getElementById("clearAll").onclick = async () => {
  await fetch('http://localhost:5000/api/clear', { method: "POST" });
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

// Charts (unchanged)
function drawCharts(data) { /* ... code unchanged ... */ }
