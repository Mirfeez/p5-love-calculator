// Love Calculator converted from Python to JavaScript
// Hooks into the existing HTML: #hisName, #herName, .btnDiv button, #resultText, .result

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

  // Combine into string then split into single digits
  const combinedStr = result.map((num) => String(num)).join("");
  return combinedStr.split("").map((d) => parseInt(d, 10));
}

function saveResult(name1, name2, score) {
  // Get existing results
  const results = JSON.parse(
    localStorage.getItem("loveCalculatorResults") || "[]"
  );

  // Add new result
  results.push({
    name1: name1.trim(),
    name2: name2.trim(),
    score: score,
    timestamp: new Date().toISOString(),
  });

  // Save back to localStorage
  localStorage.setItem("loveCalculatorResults", JSON.stringify(results));
}

function loveCalculator(name1, name2) {
  const { uniqueLetters, combined } = getUniqueLetters(name1, name2);
  const counts = countLetters(uniqueLetters, combined);

  let current = counts;
  let roundNum = 1;
  while (current.length > 2) {
    current = nextRound(current);
    roundNum++;
  }

  const finalScore = parseInt(current.join(""), 10);
  return finalScore;
}

// DOM wiring
document.addEventListener("DOMContentLoaded", () => {
  const hisInput = document.getElementById("hisName");
  const herInput = document.getElementById("herName");
  const button = document.querySelector(".btnDiv button");
  const resultText = document.getElementById("resultText");
  const resultBox = document.querySelector(".box .result");

  function showResult(his, her) {
    if (!his && !her) {
      resultText.textContent = "Please enter both names.";
      resultBox.textContent = "";
      return;
    }
    const score = loveCalculator(his, her);
    resultText.textContent = `${his.trim()} ❤️ ${her.trim()}`;
    resultBox.textContent = String(score);

    // Save result locally
    saveResult(his, her, score);
  }

  button.addEventListener("click", () => {
    showResult(hisInput.value, herInput.value);
  });

  // Allow pressing Enter in either input to trigger calculation
  [hisInput, herInput].forEach((inp) => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        showResult(hisInput.value, herInput.value);
      }
    });
  });
});
