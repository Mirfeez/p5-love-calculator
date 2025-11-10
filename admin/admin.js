// Firebase Authentication UI State
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    loadResults();
  }
});

// Login Button
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = "mahammadmirfeez@gmail.com"; // Use your admin email here
  const password = document.getElementById("adminPass").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(() => {
      document.getElementById("errorMsg").textContent = "❌ Wrong password";
    });
});

const db = firebase.firestore();
const tableBody = document.getElementById("resultsTable");

// Chart Variables
let scoreTrendChart;
let scoreFrequencyChart;

function loadResults() {
  db.collection("results").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
    const results = [];
    tableBody.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      results.push(data);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(data.timestamp.toDate()).toLocaleString()}</td>
        <td>${data.name1}</td>
        <td>${data.name2}</td>
        <td>${data.score}</td>
        <td><button class="delete-btn" onclick="deleteEntry('${doc.id}')">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });

    updateCharts(results);
  });
}

// Delete One
function deleteEntry(id) {
  db.collection("results").doc(id).delete();
}

// Clear All
document.getElementById("clearAll").addEventListener("click", () => {
  if (!confirm("Delete ALL results? ⚠")) return;

  db.collection("results").get().then((snapshot) => {
    snapshot.forEach((doc) => doc.ref.delete());
  });
});

// ------------------ 📊 Chart Logic ------------------

function updateCharts(data) {
  const timestamps = data.map(x => new Date(x.timestamp.toDate()).toLocaleTimeString());
  const scores = data.map(x => x.score);

  const frequency = {};
  scores.forEach(s => frequency[s] = (frequency[s] || 0) + 1);

  const freqLabels = Object.keys(frequency);
  const freqValues = Object.values(frequency);

  // SCORE TREND CHART
  if (scoreTrendChart) scoreTrendChart.destroy();
  scoreTrendChart = new Chart(document.getElementById("scoreTrendChart"), {
    type: "line",
    data: {
      labels: timestamps,
      datasets: [{
        label: "Score Over Time",
        data: scores,
        borderWidth: 3
      }]
    }
  });

  // SCORE FREQUENCY CHART
  if (scoreFrequencyChart) scoreFrequencyChart.destroy();
  scoreFrequencyChart = new Chart(document.getElementById("scoreFrequencyChart"), {
    type: "bar",
    data: {
      labels: freqLabels,
      datasets: [{
        label: "Score Frequency",
        data: freqValues,
        borderWidth: 3
      }]
    }
  });
}
