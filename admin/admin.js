// Load and display results
let allResults = [];

// Load and display results from Firestore
async function loadResults() {
  try {
    const snapshot = await db
      .collection("results")
      .orderBy("timestamp", "desc")
      .get();
    allResults = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    displayResults(allResults);
  } catch (error) {
    console.error("Error fetching results from Firestore: ", error);
  }
}

// Search functionality
document.querySelector(".search-box").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredResults = allResults.filter(
    (result) =>
      result.name1.toLowerCase().includes(searchTerm) ||
      result.name2.toLowerCase().includes(searchTerm)
  );
  displayResults(filteredResults);
});

// Sorting functions remain the same

// Delete function remains the same

function displayResults(results) {
  const resultsTable = document.getElementById("resultsTable");
  resultsTable.innerHTML = "";
  results.forEach((data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(data.timestamp).toLocaleString()}</td>
      <td>${data.name1}</td>
      <td>${data.name2}</td>
      <td>${data.score}%</td>
      <td>
        <button onclick="deleteResult('${data.id}')" 
                style="background: #ff3333; padding: 5px 10px;">
          Delete
        </button>
      </td>
    `;
    resultsTable.appendChild(row);
  });
}

// Load results when page loads
loadResults();

// Search functionality
document.querySelector(".search-box").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredResults = allResults.filter(
    (result) =>
      result.name1.toLowerCase().includes(searchTerm) ||
      result.name2.toLowerCase().includes(searchTerm)
  );
  displayResults(filteredResults);
});

// Sorting functions
function sortByDate(order) {
  const sorted = [...allResults].sort((a, b) => {
    return order === "desc"
      ? new Date(b.timestamp) - new Date(a.timestamp)
      : new Date(a.timestamp) - new Date(b.timestamp);
  });
  displayResults(sorted);
}

function sortByScore(order) {
  const sorted = [...allResults].sort((a, b) => {
    return order === "desc" ? b.score - a.score : a.score - b.score;
  });
  displayResults(sorted);
}

async function deleteResult(docId) {
  if (confirm("Are you sure you want to delete this result?")) {
    try {
      await db.collection("results").doc(docId).delete();
      console.log("Document successfully deleted!");
      loadResults(); // Refresh the list from Firestore
    } catch (error) {
      console.error("Error removing document: ", error);
      alert("Failed to delete result.");
    }
  }
}

function displayResults(results) {
  const resultsTable = document.getElementById("resultsTable");
  resultsTable.innerHTML = "";
  results.forEach((data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${new Date(data.timestamp).toLocaleString()}</td>
          <td>${data.name1}</td>
          <td>${data.name2}</td>
          <td>${data.score}%</td>
          <td>
            <button onclick="deleteResult('${data.id}')" 
                    style="background: #ff3333; padding: 5px 10px;">
              Delete
            </button>
          </td>
        `;
    resultsTable.appendChild(row);
  });
}

// Load results when page loads
loadResults();

// Clear All Results button
document.getElementById("clearAll").addEventListener("click", async () => {
  if (
    confirm(
      "Are you sure you want to delete ALL results? This cannot be undone."
    )
  ) {
    try {
      // Fetch all documents to delete them one by one
      const snapshot = await db.collection("results").get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("All results cleared.");
      loadResults(); // Refresh the view
    } catch (error) {
      console.error("Error clearing all results: ", error);
      alert("Failed to clear all results.");
    }
  }
});
