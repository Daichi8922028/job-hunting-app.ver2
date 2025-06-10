// home.js: ホーム画面の描画・遷移制御

document.addEventListener('DOMContentLoaded', () => {
  // ホーム画面を表示するたびに進捗やアドバイスを更新
  const homeScreen = document.getElementById('home-screen');
  if (homeScreen) {
    // ナビバーのボタンにイベント付与
    document
      .querySelector("#navbar button[onclick*='self']")
      ?.addEventListener("click", () => showAnalysisScreen('self'));
    document
      .querySelector("#navbar button[onclick*='company']")
      ?.addEventListener("click", () => showAnalysisScreen('company'));
    document
      .querySelector("#navbar button[onclick*='industry']")
      ?.addEventListener("click", () => showAnalysisScreen('industry'));

    // ホーム画面が表示されたら進捗描画
    const observer = new MutationObserver(() => {
      if (homeScreen.style.display !== "none") {
        initializeFlowVisualization();
      }
    });
    observer.observe(homeScreen, { attributes: true, attributeFilter: ['style'] });
  }

  // ビュー切り替えボタンのイベントリスナー
  document.getElementById('show-timeline')?.addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('show-progress')?.classList.remove('active');
    document.getElementById('timeline-view').style.display = 'block';
    document.getElementById('progress-view').style.display = 'none';
  });

  document.getElementById('show-progress')?.addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('show-timeline')?.classList.remove('active');
    document.getElementById('timeline-view').style.display = 'none';
    document.getElementById('progress-view').style.display = 'block';
  });
});

// 就活フロー可視化の初期化
function initializeFlowVisualization() {
  renderTimeline();
  renderProgressBar();
}

// 質問回答で学年・業界情報を取得
function getUserInfo() {
  const answers = JSON.parse(localStorage.getItem('personalizedAnswers') || "{}");
  return {
    grade: answers.grade || "3年",
    industry: answers.industry || "未定"
  };
}

// フロー定義と時期のずらし
function getPersonalizedTimeline() {
  const userInfo = getUserInfo();
  
  // 分析系（3つ巴）
  const analysisSteps = [
    { id: 'self', name: '自己分析', month: '3年春', category: 'analysis' },
    { id: 'industry', name: '業界分析', month: '3年春', category: 'analysis' },
    { id: 'company', name: '企業分析', month: '3年夏', category: 'analysis' }
  ];
  
  // 実行系（下部）
  let actionSteps = [
    { id: 'es', name: 'ES準備', month: '3年冬', category: 'action' },
    { id: 'test', name: 'Webテスト', month: '3年冬', category: 'action' },
    { id: 'interview', name: '面接', month: '4年春', category: 'action' }
  ];

  // 業界によって時期をずらす
  if (userInfo.industry === "コンサル" || userInfo.industry === "IT") {
    actionSteps = actionSteps.map(step => {
      if (step.id === "es" || step.id === "test") {
        return { ...step, month: '3年秋' };
      }
      if (step.id === "interview") {
        return { ...step, month: '3年冬' };
      }
      return step;
    });
  }

  // 学年による調整
  if (userInfo.grade === "4年" || userInfo.grade === "院2年") {
    const adjustMonth = (month) => month.replace('3年', '今年').replace('4年', '今年');
    analysisSteps.forEach(step => step.month = adjustMonth(step.month));
    actionSteps.forEach(step => step.month = adjustMonth(step.month));
  }

  return { analysisSteps, actionSteps };
}

// 進捗状況の計算（AIとの壁打ち回数やチャット履歴から）
function getStepProgress(id) {
  // チャット履歴から進捗を計算
  const chatHistory = JSON.parse(localStorage.getItem(`chat_${id}`) || "[]");
  const interactionCount = chatHistory.length;
  
  // 5回以上やり取りしていれば完了とみなす
  if (interactionCount >= 5) return 100;
  
  // 1回以上なら部分完了
  if (interactionCount >= 1) return Math.min(interactionCount * 20, 80);
  
  return 0;
}

// タイムライン型描画
function renderTimeline() {
  const area = document.getElementById('timeline-view');
  if (!area) return;
  
  const { analysisSteps, actionSteps } = getPersonalizedTimeline();
  
  let html = '<div class="timeline-flow">';
  
  // 3つ巴の分析セクション
  html += '<div class="analysis-triangle">';
  analysisSteps.forEach(step => {
    const progress = getStepProgress(step.id);
    const isDone = progress >= 100;
    const isPartial = progress > 0 && progress < 100;
    const clickable = ['self', 'industry', 'company'].includes(step.id);
    
    html += `
      <div class="timeline-step${isDone ? ' done' : (isPartial ? ' active' : '')}${clickable ? ' clickable' : ''}"
           ${clickable ? `onclick="showAnalysisScreen('${step.id}')"` : ''}>
        <div class="timeline-month">${step.month}</div>
        <div class="timeline-label">${step.name}</div>
        <div class="timeline-icon">${isDone ? '✅' : (isPartial ? '🔄' : '○')}</div>
      </div>
    `;
  });
  html += '</div>';
  
  // 下部のフローセクション
  html += '<div class="bottom-flow">';
  actionSteps.forEach(step => {
    const progress = getStepProgress(step.id);
    const isDone = progress >= 100;
    const isPartial = progress > 0 && progress < 100;
    
    html += `
      <div class="timeline-step${isDone ? ' done' : (isPartial ? ' active' : '')}">
        <div class="timeline-month">${step.month}</div>
        <div class="timeline-label">${step.name}</div>
        <div class="timeline-icon">${isDone ? '✅' : (isPartial ? '🔄' : '○')}</div>
      </div>
    `;
  });
  html += '</div>';
  
  html += '</div>';
  area.innerHTML = html;
}

// 分析画面への遷移（ナビバーのボタンで呼び出し）
function showAnalysisScreen(type) {
  console.log('🔄 Switching to analysis screen:', type);
  
  // 画面を切り替え
  if (type === "self") showScreen('analysis-self-screen');
  if (type === "company") showScreen('analysis-company-screen');
  if (type === "industry") showScreen('analysis-industry-screen');
  
  // チャットシステムが初期化されているかチェック
  if (window.chatSystem) {
    console.log('✅ Chat system found, starting new chat');
    // 新しいチャットを開始
    window.chatSystem.startNewChat(type);
  } else {
    console.log('⏳ Chat system not ready, waiting...');
    // チャットシステムが読み込まれるまで少し待つ
    setTimeout(() => {
      if (window.chatSystem) {
        console.log('✅ Chat system ready, starting new chat');
        window.chatSystem.startNewChat(type);
      } else {
        console.error('❌ Chat system still not available');
      }
    }, 100);
  }
}

// ホーム画面への戻りボタンで呼び出し（各分析画面から）
function showHomeScreen() {
  showScreen('home-screen');
}

// 分析画面でのチャット履歴を保存する関数（進捗計算用）
function saveAnalysisProgress(type, message) {
  const chatHistory = JSON.parse(localStorage.getItem(`chat_${type}`) || "[]");
  chatHistory.push({
    timestamp: Date.now(),
    message: message
  });
  localStorage.setItem(`chat_${type}`, JSON.stringify(chatHistory));
  
  // ホーム画面の進捗表示を更新
  if (document.getElementById('home-screen').style.display !== 'none') {
    initializeFlowVisualization();
  }
}

// ステップバー型描画＋進捗％バー
function renderProgressBar() {
  const area = document.getElementById('progress-view');
  if (!area) return;
  
  const { analysisSteps, actionSteps } = getPersonalizedTimeline();
  const allSteps = [...analysisSteps, ...actionSteps];
  
  // 全ステップの合計進捗％を計算
  let totalProgress = 0;
  allSteps.forEach(step => {
    totalProgress += getStepProgress(step.id);
  });
  const overallPercent = Math.round(totalProgress / allSteps.length);

  let html = `
    <div class="progress-container">
      <div class="progress-label">就活全体進捗</div>
      <div class="progress-bar-outer">
        <div class="progress-bar-inner" style="width:${overallPercent}%"></div>
      </div>
      <div class="progress-percent">${overallPercent}%</div>
    </div>
    <div class="flow-bar">
  `;
  
  // 3つ巴の分析セクション
  html += '<div class="flow-analysis-triangle">';
  analysisSteps.forEach(step => {
    const progress = getStepProgress(step.id);
    const isDone = progress >= 100;
    const clickable = ['self', 'industry', 'company'].includes(step.id);
    
    html += `<div class="flow-step${isDone ? ' done' : ''}${clickable ? ' clickable' : ''}"
             ${clickable ? `onclick="showAnalysisScreen('${step.id}')"` : ''}>${step.name}</div>`;
  });
  html += '</div>';
  
  // 下部のアクションセクション
  html += '<div class="flow-bottom-section">';
  actionSteps.forEach(step => {
  const progress = getStepProgress(step.id);
    const isDone = progress >= 100;
    html += `<div class="flow-step${isDone ? ' done' : ''}">${step.name}</div>`;
  });  html += '</div>';
  
  html += '</div>';
  area.innerHTML = html;
}
