let quizData = [];
let currentIdx = 0;

// 1. JSONファイルを読み込む
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        showQuestion();
    })
    .catch(error => console.error("データの読み込みに失敗しましたわ:", error));

// 2. 問題を表示する
function showQuestion() {
    const data = quizData[currentIdx];
    document.getElementById("question").textContent = data.q;
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    data.a.forEach((choice, i) => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = () => checkAnswer(i);
        choicesDiv.appendChild(btn);
    });
}

// 3. 正解判定
function checkAnswer(idx) {
    if (idx === quizData[currentIdx].correct) {
        alert("正解ですわ！");
    } else {
        alert("残念、不正解です...");
    }
    currentIdx = (currentIdx + 1) % quizData.length;
    showQuestion();
}