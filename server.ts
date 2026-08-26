import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { buildPrompt } from './src/lib/promptBuilder.js';
import { withHonorific } from './src/lib/format.js';
import { BuildPromptInput, MessageCandidate } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY environment variable is not set.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.post('/api/generate-message', async (req, res) => {
  try {
    const input = req.body as BuildPromptInput;
    if (!input) {
      return res.status(400).json({ error: '잘못된 요청 파라미터입니다.' });
    }
    // primaryKeyword is optional in 일반편지 mode, but there must be *something*
    // to generate from — either a topic keyword or a custom instruction.
    if (!input.primaryKeyword && !input.customInstruction?.trim()) {
      return res.status(400).json({ error: '편지 주제를 선택하거나 추가 요청사항을 입력해주세요.' });
    }

    const promptText = buildPrompt(input);

    // 수신자 등록은 선택사항 — 없으면 폴백 문구에서도 이름을 지어내지 않고
    // 일반적인 호칭으로 대체한다.
    const recipientName = input.relationship ? withHonorific(input.relationship.name) : '받는 분';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback if API key is missing
      const mockCandidates: MessageCandidate[] = [
        {
          id: 'cand-fallback-1',
          variantIndex: 1,
          title: '정중하고 품격 있는 정석형',
          toneTag: '정중/격식',
          content:
            input.category === '경사'
              ? `${recipientName}, 기쁜 소식을 접하고 진심으로 축하의 마음을 전합니다. 앞으로 펼쳐질 앞날에 늘 행복과 평안이 가득하시기를 기원합니다.`
              : input.category === '조사'
              ? `삼가 고인의 명복을 빌며, ${recipientName}과 유가족분들께 깊은 애도와 위로의 마음을 전합니다.`
              : `${recipientName}, 오랜만에 마음을 담아 몇 자 적어봅니다. 늘 곁에서 함께해준 것에 진심으로 고마운 마음을 전하고 싶었어요.`,
          etiquetteTip: '정중하고 결례 없는 무난하고 품격 있는 문구입니다.',
          charCount: 80,
        },
        {
          id: 'cand-fallback-2',
          variantIndex: 2,
          title: '진심이 따스하게 와닿는 감성형',
          toneTag: '다정/따스함',
          content:
            input.category === '경사'
              ? `${recipientName}! 소중한 경사를 진심으로 축하드려요. 항상 보여주신 소중한 마음처럼 더욱 빛나고 기쁜 일들만 가득하길 바랄게요.`
              : input.category === '조사'
              ? `${recipientName}, 갑작스러운 소식에 마음이 너무 무겁습니다. 마음 깊이 위로를 보내며, 부디 몸과 마음을 잘 추스르시길 바랄게요.`
              : `${recipientName}, 잘 지내고 있나요? 문득 생각나서 편지를 써요. 그때 함께했던 기억이 아직도 참 따뜻하게 남아있어요.`,
          etiquetteTip: '따뜻한 마음과 친근함을 동시에 담아 전달하기에 좋습니다.',
          charCount: 85,
        },
        {
          id: 'cand-fallback-3',
          variantIndex: 3,
          title: '간결하고 세련된 단정형',
          toneTag: '간결/깔끔',
          content:
            input.category === '경사'
              ? `${recipientName}의 기쁜 경사를 축하드리며, 앞날의 큰 발전과 축복을 축원합니다.`
              : input.category === '조사'
              ? `삼가 조의를 표하며 고인의 명복을 빕니다. 유가족분들께 깊은 위로를 전합니다.`
              : `${recipientName}, 짧게나마 안부를 전합니다. 늘 건강하고 좋은 일만 가득하길 바랄게요.`,
          etiquetteTip: '부담 없이 한눈에 전달되는 간결한 문구입니다.',
          charCount: 50,
        },
      ];

      return res.json({ candidates: mockCandidates, isFallback: true });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  variantIndex: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  toneTag: { type: Type.STRING },
                  content: { type: Type.STRING },
                  etiquetteTip: { type: Type.STRING },
                },
                required: ['variantIndex', 'title', 'toneTag', 'content'],
              },
            },
          },
          required: ['candidates'],
        },
      },
    });

    const rawJson = response.text || '';
    let parsedData: { candidates: any[] } = { candidates: [] };
    try {
      parsedData = JSON.parse(rawJson);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output', parseErr, rawJson);
    }

    const candidates: MessageCandidate[] = (parsedData.candidates || []).map(
      (item: any, idx: number) => ({
        id: `cand-${Date.now()}-${idx}`,
        variantIndex: item.variantIndex || idx + 1,
        title: item.title || `추천 안 ${idx + 1}`,
        toneTag: item.toneTag || '기본',
        content: item.content || '',
        etiquetteTip: item.etiquetteTip || '정성을 담아 전해보세요.',
        charCount: (item.content || '').length,
      })
    );

    res.json({ candidates });
  } catch (error: any) {
    console.error('API /api/generate-message Error:', error);
    res.status(500).json({
      error: '메시지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      details: error.message,
    });
  }
});

// Vite middleware or production static server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ 경조사 멘트 생성기 서버가 포트 ${PORT}에서 실행 중입니다.`);
  });
}

startServer();
