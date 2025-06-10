// home.js: ホーム画面の描画・遷移制御

document.addEventListener('DOMContentLoaded', () => {
  // ホーム画面を表示するたびに進捗やアドバイスを更新
  const homeScreen = document.getElementById('home-screen');
  if (homeScreen) {
    // ナビバーのボタンにイベント付与
    document
      .querySelector("#navbar button[onclick*='self']")
      .addEventListener("click", () => showAnalysisScreen('self'));
    document
      .querySelector("#navbar button[onclick*='company']")
      .addEventListener("click", () => showAnalysisScreen('company'));
    document
      .querySelector("#navbar button[onclick*='industry']")
      .addEventListener("click", () => showAnalysisScreen('industry'));

    // ホーム画面が表示されたら進捗描画
    const observer = new MutationObserver(() => {
      if (homeScreen.style.display !== "none") {
        renderJobflow();
      }
    });
    observer.observe(homeScreen, { attributes: true, attributeFilter: ['style'] });
  }
});

// 就活フロー描画ロジック
function renderJobflow() {
  const area = document.getElementById('jobflow-area');
  if (!area) return;

  // ヒアリング回答を取得（localStorageから）
  const answers = JSON.parse(localStorage.getItem('questions') || "[]");

  // 簡易進捗：回答数によって進捗を表示
  let progress = (answers.length / 5) * 100;
  progress = isNaN(progress) ? 0 : progress;

  area.innerHTML = `
    <h3>就活フロー進捗</h3>
    <div class="progress-bar" style="width:200px; background:#eee; border-radius:5px;">
      <div style="width:${progress}%; height:20px; background:#4caf50; border-radius:5px;"></div>
    </div>
    <p>ヒアリング回答済み：${answers.length} / 5問</p>
    <div>${getJobflowMessage(answers)}</div>
  `;
}

// 状況に応じたアドバイスやメッセージを返す
function getJobflowMessage(answers) {
  if (!answers || answers.length === 0) {
    return "まずはヒアリングに回答して自分の状況を明確にしましょう。";
  }
  // 例：5問すべて回答済みの場合は次ステップへ
  if (answers.length === 5) {
    return "ヒアリング完了！次は自己分析・企業分析・業界分析に進みましょう。";
  }
  return "ヒアリングに未回答の項目があります。マイページで編集可能です。";
}

// 分析画面への遷移（ナビバーのボタンで呼び出し）
function showAnalysisScreen(type) {
  if (type === "self") showScreen('analysis-self-screen');
  if (type === "company") showScreen('analysis-company-screen');
  if (type === "industry") showScreen('analysis-industry-screen');
}

// ホーム画面への戻りボタンで呼び出し（各分析画面から）
function showHomeScreen() {
  showScreen('home-screen');
}
