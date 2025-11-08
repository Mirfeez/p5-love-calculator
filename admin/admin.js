document.addEventListener("DOMContentLoaded", () => {
  // The 'db' variable is expected to be initialized in the admin.html script tag.
  if (
    typeof firebase === "undefined" ||
    typeof firebase.firestore === "undefined"
  ) {
    console.error(
      "Firebase is not initialized. Please check your Firebase configuration in admin.html."
    );
    return;
  }
  const db = firebase.firestore();

  let allResults = [];
  const resultsTable = document.getElementById("resultsTable");
  const searchBox = document.querySelector(".search-box");
  const clearAllButton = document.getElementById("clearAll");

  function displayResults(results) {
    resultsTable.innerHTML = ""; // Clear existing rows
    if (!results || results.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No results found.";
      cell.style.textAlign = "center";
      row.appendChild(cell);
      resultsTable.appendChild(row);
      return;
    }

    results.forEach((data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(data.timestamp).toLocaleString()}</td>
        <td>${data.name1}</td>
        <td>${data.name2}</td>
        <td>${data.score}%</td>
        <td>
          <button class="delete-btn" data-id="${data.id}"
                  style="background: #ff3333; padding: 5px 10px; border: none; color: white; cursor: pointer; border-radius: 4px;">
            Delete
          </button>
        </td>
      `;
      resultsTable.appendChild(row);
    });
  }

  async function loadResults() {
    try {
      const snapshot = await db
        .collection("results")
        .orderBy("timestamp", "desc")
        .get();
      allResults = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      displayResults(allResults);
    } catch (error) {
      console.error("Error fetching results from Firestore: ", error);
      alert("Failed to load results. Check console for details.");
    }
  }

  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredResults = allResults.filter(
      (result) =>
        result.name1.toLowerCase().includes(searchTerm) ||
        result.name2.toLowerCase().includes(searchTerm)
    );
    displayResults(filteredResults);
  }

  window.sortByDate = function (order) {
    const sorted = [...allResults].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
    displayResults(sorted);
  };

  window.sortByScore = function (order) {
    const sorted = [...allResults].sort((a, b) => {
      return order === "desc" ? b.score - a.score : a.score - b.score;
    });
    displayResults(sorted);
  };

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

  async function clearAllResults() {
    if (
      confirm(
        "Are you sure you want to delete ALL results? This cannot be undone."
      )
    ) {
      try {
        const snapshot = await db.collection("results").get();
        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        console.log("All results cleared.");
        loadResults(); // Refresh the view
      } catch (error) {
        console.error("Error clearing all results: ", error);
        alert("Failed to clear all results.");
      }
    }
  }

  // Event Listeners
  searchBox.addEventListener("input", handleSearch);
  clearAllButton.addEventListener("click", clearAllResults);
  resultsTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const docId = e.target.dataset.id;
      deleteResult(docId);
    }
  });

  // Initial load of results when the page is ready
  loadResults();
});
