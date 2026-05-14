let quizData = [];
let currentIdx = 0;
let score = 0; // 正解数を数える
let wrongQuestions = []; // 間違えた問題のインデックスを保存する
let isReviewMode = false; // 「解き直しモード」かどうか

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
    document.getElementById("explanation-container").style.display = "none";
    
    // 今解いている問題のデータを取得
    const data = isReviewMode ? wrongQuestions[currentIdx] : quizData[currentIdx];
    
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

// 3. 正解判定
function checkAnswer(idx) {
    const data = isReviewMode ? wrongQuestions[currentIdx] : quizData[currentIdx];
    const buttons = document.querySelectorAll("#choices button");
    const resultText = document.getElementById("result-text");
    const expContainer = document.getElementById("explanation-container");

    buttons.forEach(btn => btn.disabled = true);
    const correctIdx = parseInt(data.correct);

    if (idx === correctIdx) {
        if (!isReviewMode) score++; // 通常モードの時だけスコアを加算
        buttons[idx].style.backgroundColor = "#d4edda";
        resultText.textContent = "⭕ 正解ですわ！";
        resultText.style.color = "#28a745";
    } else {
        // 間違えた問題をリストに追加（まだリストに入っていない場合のみ）
        if (!isReviewMode && !wrongQuestions.includes(data)) {
            wrongQuestions.push(data);
        }
        buttons[idx].style.backgroundColor = "#f8d7da";
        buttons[correctIdx].style.backgroundColor = "#e7f3ff"; // 正解を青くする
        resultText.textContent = "❌ 不正解です...";
        resultText.style.color = "#dc3545";
    }

    document.getElementById("explanation-text").innerHTML = data.explanation;
    expContainer.style.display = "block";
}

// 4. 次へボタン または リザルト表示
function nextQuestion() {
    currentIdx++;
    const currentList = isReviewMode ? wrongQuestions : quizData;

    if (currentIdx < currentList.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// 5. 結果発表（パーセント表示と解き直しボタン）
function showResult() {
    const total = isReviewMode ? wrongQuestions.length : quizData.length;
    const percent = Math.round((score / quizData.length) * 100);
    
    let resultMsg = isReviewMode ? "解き直し終了ですわ！" : `全問終了！正解率は ${percent}% ですわ。`;
    
    let html = `<h2>${resultMsg}</h2>`;
    
    // 通常モード終了時で、間違えた問題がある場合
    if (!isReviewMode && wrongQuestions.length > 0) {
        html += `<p>${quizData.length}問中、${wrongQuestions.length}問間違えました。</p>`;
        html += `<button onclick="startReview()" style="background:#ffc107; color:black; width:100%; font-weight:bold;">間違えた問題だけ解き直す</button>`;
    }
    
    html += `<button onclick="location.reload()" style="margin-top:10px; width:100%;">最初からやり直す</button>`;
    
    document.getElementById("quiz-container").innerHTML = html;
}

// 6. 解き直しモード開始
function startReview() {
    isReviewMode = true;
    currentIdx = 0;
    // 画面を元のクイズ形式に戻す
    document.getElementById("quiz-container").innerHTML = `
        <h2 id="question"></h2>
        <div id="choices"></div>
        <div id="explanation-container" style="display:none;">
            <p id="result-text"></p>
            <p id="explanation-text"></p>
            <button id="next-btn" onclick="nextQuestion()">次の問題へ</button>
        </div>
    `;
    showQuestion();
}