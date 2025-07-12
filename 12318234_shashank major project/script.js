document.getElementById('toggle-dark-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

function compareTextInputs() {
  const text1 = document.getElementById("text1").value;
  const text2 = document.getElementById("text2").value;

  if (!text1 || !text2) {
    alert("Please fill both text fields.");
    return;
  }

  const similarity = stringSimilarity(text1, text2).toFixed(2);
  showResult(`Text Similarity: ${similarity}%`);
  saveHistory(`Text1 vs Text2 = ${similarity}%`);
}

function compareTwoFiles() {
  const file1 = document.getElementById("file1").files[0];
  const file2 = document.getElementById("file2").files[0];

  if (!file1 || !file2) {
    alert("Please upload both files.");
    return;
  }

  Promise.all([file1.text(), file2.text()])
    .then(([text1, text2]) => {
      const similarity = stringSimilarity(text1, text2).toFixed(2);
      showResult(`File Similarity: ${similarity}%`);
      saveHistory(`File1 vs File2 = ${similarity}%`);
    });
}

function stringSimilarity(str1, str2) {
  str1 = str1.toLowerCase().replace(/[^a-z0-9]/g, "");
  str2 = str2.toLowerCase().replace(/[^a-z0-9]/g, "");
  const length = Math.min(str1.length, str2.length);
  let same = 0;
  for (let i = 0; i < length; i++) {
    if (str1[i] === str2[i]) same++;
  }
  return (same / length) * 100;
}

function showResult(msg) {
  document.getElementById("resultOutput").innerText = msg;
  document.getElementById("resultSection").hidden = false;
  localStorage.setItem("lastReport", msg);
}

function downloadReport() {
  const text = document.getElementById("resultOutput").innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "plagiarism_report.txt";
  link.click();
}

function saveHistory(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  document.getElementById("historyList").appendChild(li);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function () {
  document.getElementById("scrollBtn").style.display = window.scrollY > 100 ? "block" : "none";
};

function showPage(page) {
  document.getElementById("mainPage").style.display = (page === 'main') ? 'block' : 'none';
  document.getElementById("historyPage").style.display = (page === 'history') ? 'block' : 'none';
}
function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleString(); // Date and time
}

function showResult(similarityText, words1 = [], words2 = []) {
  document.getElementById("resultOutput").innerText = similarityText;
  document.getElementById("resultSection").hidden = false;

  const timestamp = getCurrentDateTime();
  const reportData = generateDetailedReport(words1, words2, similarityText, timestamp);
  localStorage.setItem("lastReport", reportData);
}

function downloadReport() {
  const reportText = localStorage.getItem("lastReport");
  const blob = new Blob([reportText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "detailed_plagiarism_report.txt";
  link.click();
}

function generateDetailedReport(words1, words2, similarityText, timestamp) {
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const similar = [...set1].filter(word => set2.has(word));
  const dissimilar = [...new Set([...words1, ...words2])].filter(word => !set1.has(word) || !set2.has(word));

  return `📝 Detailed Plagiarism Report
----------------------------------------
📅 Date & Time: ${timestamp}
📊 Similarity Score: ${similarityText}

✅ Similar Words:
${similar.join(", ")}

❌ Dissimilar Words:
${dissimilar.join(", ")}

Thank you for using our plagiarism checker!
`;
}

function compareTextInputs() {
  const text1 = document.getElementById("text1").value;
  const text2 = document.getElementById("text2").value;
  if (!text1 || !text2) return alert("Paste both texts!");

  const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
  const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];

  const similarity = stringSimilarity(text1, text2).toFixed(2);
  const resultText = `Text Similarity: ${similarity}%`;

  showResult(resultText, words1, words2);
  saveHistory(resultText);
}

function compareTwoFiles() {
  const file1 = document.getElementById("file1").files[0];
  const file2 = document.getElementById("file2").files[0];
  if (!file1 || !file2) return alert("Upload both files!");

  Promise.all([file1.text(), file2.text()]).then(([text1, text2]) => {
    const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
    const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];

    const similarity = stringSimilarity(text1, text2).toFixed(2);
    const resultText = `File Similarity: ${similarity}%`;

    showResult(resultText, words1, words2);
    saveHistory(resultText);
  });
}
