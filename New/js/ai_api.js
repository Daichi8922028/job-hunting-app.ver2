// ai_api.js: Google AI Studio API連携

function getInitialApiKey() {
  // 環境変数からAPIキーを読み込む
  return window.env.GEMINI_API_KEY || 'YOUR_GOOGLE_AI_STUDIO_API_KEY'; // 修正
}

class AIAPIService {
  constructor() {
    // 安全なソースからAPIキーを取得
    this.apiKey = getInitialApiKey();
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    this.isEnabled = this.apiKey && this.apiKey !== 'YOUR_GOOGLE_AI_STUDIO_API_KEY' && this.apiKey.trim() !== '';
    
    console.log('🚀 AIAPIService initialized with key:', this.apiKey ? 'VALID' : 'MISSING');
    console.log('🔧 API Enabled:', this.isEnabled);
  }

  /**
   * Google AI Studio APIを使用してレスポンスを生成
   * @param {string} type - チャットの種類 ('self', 'company', 'industry')
   * @param {string} message - ユーザーのメッセージ
   * @param {Array} chatHistory - 会話履歴
   * @returns {Promise<string>} AIの応答
   */
  async generateResponse(type, message, chatHistory = []) {
    console.log('🔍 Gemini API Debug Info:');
    console.log('API Key:', this.apiKey ? 'Set (' + this.apiKey.substring(0, 10) + '...)' : 'Not set');
    console.log('Is Enabled:', this.isEnabled);
    console.log('Message:', message);

    // APIキーが設定されていない場合は仮実装を使用
    if (!this.isEnabled || this.apiKey === 'YOUR_GOOGLE_AI_STUDIO_API_KEY' || !this.apiKey) {
      console.log('❌ Using fallback response - API not enabled');
      return this.getMockResponse(type, message);
    }

    try {
      const prompt = this.buildPrompt(type, message, chatHistory);
      console.log('📝 Generated prompt:', prompt.substring(0, 100) + '...');
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      console.log('🚀 Sending request to Gemini API...');
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('✅ Gemini AI Response:', aiResponse.substring(0, 100) + '...');
        return aiResponse;
      } else {
        console.error('❌ Invalid response format:', data);
        throw new Error('Invalid response format from API');
      }
      
    } catch (error) {
      console.error('❌ AI API Error:', error);
      console.log('🔄 Falling back to mock response');
      // エラー時は仮実装にフォールバック
      return this.getMockResponse(type, message);
    }
  }

  /**
   * チャットタイプに応じたプロンプトを構築
   * @param {string} type - チャットの種類
   * @param {string} message - ユーザーのメッセージ
   * @param {Array} chatHistory - 会話履歴
   * @returns {string} 構築されたプロンプト
   */
  buildPrompt(type, message, chatHistory) {
    const systemPrompts = {
      self: `あなたは就職活動における自己分析の専門家です。学生が自分の強み、価値観、キャリア目標を明確にできるよう支援してください。

以下の点を重視してください：
- 具体的な経験やエピソードを引き出す質問をする
- 学生の回答から強みや価値観を見つけ出す
- 将来のキャリアとの関連性を示す
- 励ましとポジティブなフィードバックを提供する
- 日本語で自然で親しみやすい口調で回答する`,

      company: `あなたは企業分析の専門家です。就職活動中の学生が企業研究を効果的に行えるよう支援してください。

以下の点を重視してください：
- 企業の事業内容、理念、文化について詳しく説明する
- 業界での立ち位置や競合他社との比較を提供する
- 成長性や将来性について分析する
- 実際の働き方や職場環境について情報を提供する
- 学生のキャリア目標との適合性を考慮したアドバイスをする
- 日本語で専門的かつ分かりやすく回答する`,

      industry: `あなたは業界分析の専門家です。就職活動中の学生が各業界について深く理解できるよう支援してください。

以下の点を重視してください：
- 業界の現状、トレンド、将来性について詳しく説明する
- 主要企業や市場規模について情報を提供する
- 必要なスキルや資格、キャリアパスを説明する
- 業界特有の課題や機会について言及する
- 学生の興味や適性に合わせたアドバイスを提供する
- 日本語で専門的かつ分かりやすく回答する`
    };

    let prompt = systemPrompts[type] || systemPrompts.self;
    
    // 会話履歴を追加
    if (chatHistory.length > 0) {
      prompt += '\n\n過去の会話:\n';
      chatHistory.slice(-5).forEach(entry => { // 直近5件の会話のみ
        prompt += `${entry.sender === 'user' ? 'ユーザー' : 'AI'}: ${entry.content}\n`;
      });
    }
    
    prompt += `\n\n現在のユーザーの質問: ${message}\n\n上記を踏まえて、親切で建設的な回答をしてください。`;
    
    return prompt;
  }

  /**
   * 仮実装：ランダムな応答を返す
   * @param {string} type - チャットの種類
   * @param {string} message - ユーザーのメッセージ
   * @returns {Promise<string>} 仮の応答
   */
  async getMockResponse(type, message) {
    const responses = {
      self: [
        'あなたの強みや価値観について詳しく教えてください。具体的なエピソードがあれば、それも含めて話していただけますか？',
        'これまでの経験で最も成長を感じた出来事は何ですか？その経験から何を学びましたか？',
        'あなたが大切にしている価値観は何ですか？それが仕事にどう活かせると思いますか？',
        '将来のキャリア目標について教えてください。どのような分野で活躍したいと考えていますか？',
        'チームで何かを成し遂げた経験はありますか？その時のあなたの役割や貢献について教えてください。',
        '困難な状況を乗り越えた経験はありますか？どのように解決しましたか？',
        'あなたが最もやりがいを感じる瞬間はどのような時ですか？',
        '他の人からよく言われる、あなたの特徴や長所は何ですか？'
      ],
      company: [
        'その企業について詳しく調べるために、まず業界や事業内容について確認しましょう。どの分野の企業ですか？',
        '企業研究では、事業内容、企業理念、成長性、職場環境などを調べることが重要です。特に知りたい点はありますか？',
        '企業の最新の業績や市場での立ち位置、競合他社との比較も大切な要素です。',
        'その企業で働く人々の声や企業文化について調べることで、自分に合う環境かどうか判断できます。',
        '企業のIR情報や決算説明書を確認することで、財務状況や今後の戦略を把握できます。',
        '実際の社員の方の話を聞く機会があれば、よりリアルな情報を得ることができますね。',
        '企業の社会貢献活動やSDGsへの取り組みも、企業の価値観を知る重要な指標です。',
        '働き方改革への取り組みや福利厚生についても確認しておくと良いでしょう。'
      ],
      industry: [
        'その業界の現在のトレンドや将来性について詳しく分析してみましょう。特に注目している点はありますか？',
        '業界の主要な企業や市場規模、成長要因について調べることが重要です。',
        'その業界で求められるスキルや資格、キャリアパスについても確認しましょう。',
        '業界の課題や今後の展望についても理解を深めることで、より良い判断ができます。',
        'デジタル化やAI技術の導入が各業界にどのような影響を与えているかも注目すべき点です。',
        'グローバル化が進む中で、その業界の国際的な動向も把握しておくと良いでしょう。',
        '規制の変化や政府の政策が業界に与える影響についても考慮する必要があります。',
        '持続可能性や環境への配慮が求められる中で、業界がどう対応しているかも重要です。'
      ]
    };

    // メッセージの内容に基づいて適切な応答を選択
    const typeResponses = responses[type] || responses.self;
    let selectedResponse;

    // キーワードベースの簡単な応答選択ロジック
    const lowerMessage = message.toLowerCase();
    
    if (type === 'self') {
      if (lowerMessage.includes('強み') || lowerMessage.includes('長所')) {
        selectedResponse = typeResponses[0];
      } else if (lowerMessage.includes('経験') || lowerMessage.includes('体験')) {
        selectedResponse = typeResponses[1];
      } else if (lowerMessage.includes('価値観') || lowerMessage.includes('大切')) {
        selectedResponse = typeResponses[2];
      } else if (lowerMessage.includes('将来') || lowerMessage.includes('目標') || lowerMessage.includes('キャリア')) {
        selectedResponse = typeResponses[3];
      } else {
        selectedResponse = typeResponses[Math.floor(Math.random() * typeResponses.length)];
      }
    } else {
      selectedResponse = typeResponses[Math.floor(Math.random() * typeResponses.length)];
    }

    // 応答の遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return selectedResponse;
  }

  /**
   * APIキーを設定
   * @param {string} apiKey - Google AI Studio APIキー
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.isEnabled = apiKey && apiKey !== 'YOUR_GOOGLE_AI_STUDIO_API_KEY' && apiKey.trim() !== '';
  }

  /**
   * API使用可能かどうかを確認
   * @returns {boolean} API使用可能かどうか
   */
  isApiEnabled() {
    return this.isEnabled;
  }
}

// グローバルなインスタンスを作成
window.aiApiService = new AIAPIService();