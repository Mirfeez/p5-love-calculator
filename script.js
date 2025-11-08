// DOM wiring
document.addEventListener("DOMContentLoaded", () => {
  // Ensure Firebase is initialized before using it.
  // The 'db' variable is expected to be initialized in the HTML script tag.
  if (
    typeof firebase === "undefined" ||
    typeof firebase.firestore === "undefined"
  ) {
    console.error(
      "Firebase is not initialized. Please check your Firebase configuration in index.html."
    );
    // Disable functionality if Firebase is not available.
    document.querySelector(".btnDiv button").disabled = true;
    return;
  }
  const db = firebase.firestore();

  const hisInput = document.getElementById("hisName");
  const herInput = document.getElementById("herName");
  const button = document.querySelector(".btnDiv button");
  const resultText = document.getElementById("resultText");
  const resultBox = document.querySelector(".box .result");

  function getUniqueLetters(name1, name2) {
    const combined = (name1 + name2).toLowerCase();
    const uniqueLetters = [];
    for (const ch of combined) {
      if (/[a-z]/.test(ch) && !uniqueLetters.includes(ch)) {
        uniqueLetters.push(ch);
      }
    }
    return { uniqueLetters, combined };
  }

  function countLetters(uniqueLetters, combined) {
    return uniqueLetters.map((ch) => {
      let count = 0;
      for (const c of combined) if (c === ch) count++;
      return count;
    });
  }

  function nextRound(numbers) {
    const result = [];
    const n = numbers.length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
      result.push(numbers[i] + numbers[n - 1 - i]);
    }
    if (n % 2 !== 0) result.push(numbers[Math.floor(n / 2)]);

    const combinedStr = result.map(String).join("");
    return combinedStr.split("").map(Number);
  }

  function loveCalculator(name1, name2) {
    const { uniqueLetters, combined } = getUniqueLetters(name1, name2);
    if (uniqueLetters.length === 0) return 0;

    const counts = countLetters(uniqueLetters, combined);

    let current = counts;
    while (current.length > 2) {
      current = nextRound(current);
    }

    return parseInt(current.join(""), 10) || 0;
  }

  async function saveResult(name1, name2, score) {
    const newResult = {
      name1: name1.trim(),
      name2: name2.trim(),
      score: score,
      timestamp: new Date().toISOString(),
    };

    try {
      await db.collection("results").add(newResult);
      console.log("Result saved successfully.");
    } catch (error) {
      console.error("Error writing document to Firestore: ", error);
      // Optionally, inform the user that the result could not be saved.
      alert(
        "Could not save the result. Please check your connection and Firebase setup."
      );
    }
  }

  function calculateAndShowResult() {
    const his = hisInput.value.trim();
    const her = herInput.value.trim();

    if (!his && !her) {
      resultText.textContent = "Please enter both names.";
      resultBox.textContent = "";
      return;
    }

    const score = loveCalculator(his, her);
    resultText.textContent = `${his || "..."} ❤️ ${her || "..."}`;
    resultBox.textContent = String(score);

    // Save result to Firestore
    saveResult(his, her, score);
  }

  button.addEventListener("click", () => {
    calculateAndShowResult();
  });

  // Allow pressing Enter in either input to trigger calculation
  [hisInput, herInput].forEach((inp) => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        calculateAndShowResult();
      }
    });
  });
});
