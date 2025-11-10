function calculateLove() {
  let name1 = document.getElementById("hisName").value.trim();
  let name2 = document.getElementById("herName").value.trim();

  if (name1 === "" || name2 === "") {
    alert("Please enter both names.");
    return;
  }

  // Your love score calculation (you can adjust formula later)
  let score = Math.floor(Math.random() * 100) + 1;

  // Display result on page
  document.getElementById("result").innerText = `${score}% ❤️`;

  // ✅ Send the data to Google Sheets
  sendData(name1, name2, score);
}

// ✅ Function to send results to Google Sheet API (Web App URL)
function sendData(name1, name2, score) {
  fetch("https://script.google.com/macros/s/AKfycbzozip_OJkNez7DAIpEnlkzzXCL6hHUBj0FaPsaIS6PzQlcaYXmEle_b8gTACARE_-_BA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      hisName: name1,
      herName: name2,
      score: score,
      datetime: new Date().toLocaleString(),
      userAgent: navigator.userAgent
    })
  });
}
