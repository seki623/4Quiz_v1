let quizData = [];
let currentIdx = 0;
let score = 0;
let wrongQuestions = [];
let isReviewMode = false;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        const urlParams = new URLSearchParams(window.location.search);
        const startQ = parseInt(urlParams.get('q')); // URLに ?q=50 とかあれば取得

        if (startQ && startQ > 0 && startQ <= quizData.length) {
            currentIdx = startQ - 1; // 問題番号は0から始まるので1引く
        }
        showQuestion();
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("question").textContent = "データの読み込みに失敗しましたわ。";
    });

function showQuestion() {
    const explanationContainer = document.getElementById("explanation-container");
    explanationContainer.style.display = "none";
    
    // 現在のリスト（通常 or 解き直し）を判定
    const currentList = isReviewMode ? wrongQuestions : quizData;
    const total = currentList.length;
    const data = currentList[currentIdx];

    // 進捗表示の更新（バーと数字）
    const progressPercent = ((currentIdx + 1) / total) * 100;
    document.getElementById("progress-bar-fill").style.width = progressPercent + "%";
    const modeText = isReviewMode ? "【解き直し】" : "";
    document.getElementById("progress-text").textContent = `${modeText}${currentIdx + 1} / ${total}`;

    document.getElementById("question").innerHTML = data.q;
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    const choices = [data.a0, data.a1, data.a2, data.a3];
    choices.forEach((choice, i) => {
        const btn = document.createElement("button");
        btn.innerHTML = choice;
        btn.onclick = () => checkAnswer(i);
        choicesDiv.appendChild(btn);
    });
}

function checkAnswer(idx) {
    const currentList = isReviewMode ? wrongQuestions : quizData;
    const data = currentList[currentIdx];
    const buttons = document.querySelectorAll("#choices button");
    const resultText = document.getElementById("result-text");
    const expText = document.getElementById("explanation-text");

    buttons.forEach(btn => btn.disabled = true);
    const correctIdx = parseInt(data.correct);

    if (idx === correctIdx) {
        if (!isReviewMode) score++;
        buttons[idx].style.backgroundColor = "#d4edda";
        buttons[idx].style.borderColor = "#28a745";
        buttons[idx].innerHTML = "⭕ " + buttons[idx].innerHTML;
        resultText.textContent = "⭕ 正解ですわ！";
        resultText.style.color = "#28a745";
    } else {
        if (!isReviewMode && !wrongQuestions.includes(data)) {
            wrongQuestions.push(data);
        }
        buttons[idx].style.backgroundColor = "#f8d7da";
        buttons[idx].style.borderColor = "#dc3545";
        buttons[idx].innerHTML = "❌ " + buttons[idx].innerHTML;
        
        buttons[correctIdx].style.backgroundColor = "#e7f3ff";
        buttons[correctIdx].style.borderColor = "#007bff";
        resultText.textContent = "❌ 不正解です...";
        resultText.style.color = "#dc3545";
    }

    // 解説を表示（JSONの列名が 'exp' か 'explanation' か確認してくださいね）
    expText.innerHTML = data.exp || data.explanation || "解説はありません。";
    document.getElementById("explanation-container").style.display = "block";
}

function nextQuestion() {
    currentIdx++;
    const currentList = isReviewMode ? wrongQuestions : quizData;

    if (currentIdx < currentList.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const totalQuestions = quizData.length;
    const percent = Math.round((score / totalQuestions) * 100);
    
    let resultMsg = isReviewMode ? "解き直し終了ですわ！" : `全問終了！正解率は ${percent}% ですわ。`;
    let html = `<h2>${resultMsg}</h2>`;
    
    if (!isReviewMode && wrongQuestions.length > 0) {
        html += `<p>${totalQuestions}問中、${wrongQuestions.length}問間違えました。</p>`;
        html += `<button onclick="startReview()" style="background:#ffc107; color:black; width:100%; font-weight:bold; padding:12px; border:none; border-radius:8px; cursor:pointer;">間違えた問題だけ解き直す</button>`;
    } else if (isReviewMode) {
        html += `<p>全問正解まであと少しですわ！</p>`;
    }
    
    html += `<button onclick="location.reload()" style="margin-top:10px; width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; cursor:pointer;">最初からやり直す</button>`;
    
    document.getElementById("quiz-container").innerHTML = html;
}

function startReview() {
    isReviewMode = true;
    currentIdx = 0;
    // 画面をリセット
    location.reload; // 簡易的なリセットとして。本来はDOM再構築ですが今回はこのまま
    // ※以下、再描画の代わりにコンテナを戻す処理
    document.getElementById("quiz-container").innerHTML = `
        <div id="progress-container"><div id="progress-text"></div><div id="progress-bar-bg"><div id="progress-bar-fill"></div></div></div>
        <h2 id="question"></h2><div id="choices"></div>
        <div id="explanation-container"><p id="result-text"></p><p id="explanation-text"></p><button id="next-btn" onclick="nextQuestion()">次の問題へ</button></div>
    `;
    showQuestion();
}