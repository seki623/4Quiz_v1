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
        console.error("データの読み込みに失敗しましたわ:", error);
        document.getElementById("question").textContent = "データの読み込みに失敗しました。";
    });

// 2. 問題を表示する
function showQuestion() {
    // 解説エリアを隠す
    const expContainer = document.getElementById("explanation-container");
    if (expContainer) expContainer.style.display = "none";

    const data = quizData[currentIdx];
    document.getElementById("question").textContent = data.q;
    
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    // スプレッドシートの形式に合わせて a0, a1, a2, a3 を配列にまとめます
    const choices = [data.a0, data.a1, data.a2, data.a3];

    choices.forEach((choice, i) => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = () => checkAnswer(i);
        choicesDiv.appendChild(btn);
    });
}

// 3. 正解判定と解説の表示
function checkAnswer(idx) {
    const data = quizData[currentIdx];
    const expContainer = document.getElementById("explanation-container");
    const resultText = document.getElementById("result-text");
    const expText = document.getElementById("explanation-text");

    // 全ての選択肢ボタンを無効化（解説中に何度も押せないようにします）
    const buttons = document.querySelectorAll("#choices button");
    buttons.forEach(btn => btn.disabled = true);

    // 正誤判定
    if (idx === parseInt(data.correct)) {
        resultText.textContent = "⭕ 正解ですわ！";
        resultText.style.color = "#28a745"; // 清潔感のある緑色
    } else {
        resultText.textContent = "❌ 不正解です...";
        resultText.style.color = "#dc3545"; // 警告の赤色
    }

    // 解説文を表示（JSONのexplanationキーを読み込みます）
    expText.textContent = data.explanation;
    expContainer.style.display = "block"; 
}

// 4. 次の問題へ進む（「次の問題へ」ボタンから呼ばれます）
function nextQuestion() {
    currentIdx++;
    
    // 全問終了したら最初に戻る（または終了メッセージを出す）
    if (currentIdx < quizData.length) {
        showQuestion();
    } else {
        alert("全問終了しましたわ！最初からやり直します。");
        currentIdx = 0;
        showQuestion();
    }
}