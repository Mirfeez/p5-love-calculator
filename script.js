const hisInput = document.getElementById("hisName");
const herInput = document.getElementById("herName");
const button = document.querySelector(".btnDiv button");
const resultText = document.getElementById("resultText");
const resultBox = document.querySelector(".box .result");

document.addEventListener("DOMContentLoaded", () => {
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
    let current = countLetters(uniqueLetters, combined);
    while (current.length > 2) current = nextRound(current);
    return parseInt(current.join(""), 10) || 0;
  }

  async function saveResult(his, her, score) {
    try {
      if (window.database && typeof window.database.ref === 'function') {
        await window.database.ref('love-calculator-results').push({
          name1: his.trim(),
          name2: her.trim(),
          score: score,
          timestamp: new Date().toISOString()
        });
        return;
      }
    } catch (err) {
      console.warn('Firebase write failed:', err);
    }

    // Fallback: store locally
    const results = JSON.parse(localStorage.getItem('loveCalculatorResults') || '[]');
    results.push({ name1: his.trim(), name2: her.trim(), score, timestamp: new Date().toISOString() });
    localStorage.setItem('loveCalculatorResults', JSON.stringify(results));
  }

  function calculateAndShowResult() {
    const his = hisInput.value;
    const her = herInput.value;
    if (!his || !her) {
      resultText.textContent = "Enter both names 💬";
      resultBox.textContent = "";
      return;
    }

    const score = loveCalculator(his, her);
    resultText.textContent = `${his} ❤️ ${her}`;
    resultBox.textContent = score;

    saveResult(his, her, score);
  }

  button.addEventListener("click", calculateAndShowResult);

  hisInput.addEventListener("keydown", (e) => e.key === "Enter" && calculateAndShowResult());
  herInput.addEventListener("keydown", (e) => e.key === "Enter" && calculateAndShowResult());
});


