let quizData = [];
let currentIdx = 0;

// 1. JSONファイルを読み込む
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        showQuestion();
    })
    .catch(error => {
        console.error("読み込みエラー:", error);
        document.getElementById("question").textContent = "データの読み込みに失敗しましたわ。";
    });

// 2. 問題を表示する
function showQuestion() {
    // 前回の解説を隠す
    document.getElementById("explanation-container").style.display = "none";

    const data = quizData[currentIdx];
    // innerHTMLにすることでスプシの <br> を有効化します
    document.getElementById("question").innerHTML = data.q;
    
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    const choices = [data.a0, data.a1, data.a2, data.a3];

    choices.forEach((choice, i) => {
        const btn = document.createElement("button");
        btn.innerHTML = choice; // 選択肢内の改行等にも対応
        btn.onclick = () => checkAnswer(i);
        choicesDiv.appendChild(btn);
    });
}

// 3. 正解判定と視覚演出
function checkAnswer(idx) {
    const data = quizData[currentIdx];
    const buttons = document.querySelectorAll("#choices button");
    const expContainer = document.getElementById("explanation-container");
    const resultText = document.getElementById("result-text");
    const expText = document.getElementById("explanation-text");

    // 全ボタンを無効化
    buttons.forEach(btn => btn.disabled = true);

    const selectedButton = buttons[idx];
    const correctIdx = parseInt(data.correct);

    if (idx === correctIdx) {
        // 正解の演出
        selectedButton.style.backgroundColor = "#d4edda";
        selectedButton.style.borderColor = "#28a745";
        selectedButton.innerHTML = "⭕ " + selectedButton.innerHTML;
        resultText.textContent = "⭕ 正解ですわ！";
        resultText.style.color = "#28a745";
    } else {
        // 不正解の演出
        selectedButton.style.backgroundColor = "#f8d7da";
        selectedButton.style.borderColor = "#dc3545";
        selectedButton.innerHTML = "❌ " + selectedButton.innerHTML;
        
        // 正解のボタンも教えてあげる
        buttons[correctIdx].style.backgroundColor = "#e7f3ff";
        buttons[correctIdx].style.borderColor = "#007bff";
        buttons[correctIdx].innerHTML = "💡 " + buttons[correctIdx].innerHTML;

        resultText.textContent = "❌ 不正解です...";
        resultText.style.color = "#dc3545";
    }

    // 解説を表示
    expText.innerHTML = data.explanation;
    expContainer.style.display = "block"; 
}

// 4. 次の問題へ
function nextQuestion() {
    currentIdx++;
    if (currentIdx < quizData.length) {
        showQuestion();
    } else {
        alert("全問終了しましたわ！最初に戻ります。");
        currentIdx = 0;
        showQuestion();
    }
}