function calculateLove() {
  let name1 = document.getElementById("hisName").value.trim();
  let name2 = document.getElementById("herName").value.trim();

  if (name1 === "" || name2 === "") {
    alert("Please enter both names.");
    return;
  }

  // Your love score calculation
  let score = Math.floor(Math.random() * 100) + 1;

  // Show result on screen
  document.getElementById("result").innerText = `${score}% ❤️`;

  // ✅ Save to Google Sheet
  sendData(name1, name2, score);
}

// ✅ FUNCTION THAT SENDS DATA TO GOOGLE SHEET
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
