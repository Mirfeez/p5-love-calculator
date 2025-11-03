
    let allResults = [];

    // Load and display results
    function loadResults() {
      // Get results from localStorage
      allResults = JSON.parse(localStorage.getItem('loveCalculatorResults') || '[]');
      displayResults(allResults);
    }

    // Search functionality
    document.querySelector('.search-box').addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredResults = allResults.filter(result =>
        result.name1.toLowerCase().includes(searchTerm) ||
        result.name2.toLowerCase().includes(searchTerm)
      );
      displayResults(filteredResults);
    });

    // Sorting functions
    function sortByDate(order) {
      const sorted = [...allResults].sort((a, b) => {
        return order === 'desc'
          ? new Date(b.timestamp) - new Date(a.timestamp)
          : new Date(a.timestamp) - new Date(b.timestamp);
      });
      displayResults(sorted);
    }

    function sortByScore(order) {
      const sorted = [...allResults].sort((a, b) => {
        return order === 'desc'
          ? b.score - a.score
          : a.score - b.score;
      });
      displayResults(sorted);
    }

    function deleteResult(timestamp) {
      if (confirm('Are you sure you want to delete this result?')) {
        allResults = allResults.filter(result => result.timestamp !== timestamp);
        localStorage.setItem('loveCalculatorResults', JSON.stringify(allResults));
        displayResults(allResults);
      }
    }

    function displayResults(results) {
      const resultsTable = document.getElementById('resultsTable');
      resultsTable.innerHTML = '';
      results.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(data.timestamp).toLocaleString()}</td>
          <td>${data.name1}</td>
          <td>${data.name2}</td>
          <td>${data.score}%</td>
          <td>
            <button onclick="deleteResult('${data.timestamp}')" 
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