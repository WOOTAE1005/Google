import { BuildPromptInput, MessageFormat } from '../types';

export function getFormatRule(format: MessageFormat): string {
  switch (format) {
    case '봉투문구':
      return `
Format Rule [봉투문구]:
- 경조사 봉투 또는 카드에 기재할 짧고 품격 있는 10~25자 내외의 정제된 표제어입니다.
- 전통 한자 표기(예: 祝 結婚, 祝 昇進, 謹弔 등)나 현대적인 세련된 문구를 조합하세요.
- 불필요한 서론/결론 없이 대표 문구 중심으로 3가지 안을 다채롭게 제시하세요.
`;
    case '문자':
      return `
Format Rule [문자 (SMS/LMS)]:
- 3~5문장 (100~200자 내외)의 단정하고 완결성 있는 메시지입니다.
- 첫인사 - 본론(축하/조의/쾌유의 마음) - 상대방의 안녕과 기원을 바라는 마무리가 깔끔하게 어우러지도록 작성하세요.
- 모바일 문자로 읽기 편한 줄바꿈과 어조를 유지하세요.
`;
    case '카톡메시지':
      return `
Format Rule [카톡메시지]:
- 가독성이 뛰어나고 모바일 카카오톡 화면에서 자연스럽게 읽히는 문맥입니다.
- 관계에 따라 가벼운 이모지(🌸, 🙏, 💐, ✨ 등)를 과하지 않게 적절히 활용하세요 (조사의 경우 이모지 최소화/진중함 유지).
- 따스함과 친근함, 문맥에 맞는 정성을 한눈에 보여주세요.
`;
    case '편지':
      return `
Format Rule [편지]:
- 깊은 진심과 관계의 서사를 담은 300~500자 내외의 감동적인 긴 글입니다.
- 문단을 나누어 정성스러운 축하/조의와 함께 고마움, 추억, 축복을 엮어 작성하세요.
`;
    default:
      return '';
  }
}

export function buildPrompt(input: BuildPromptInput): string {
  const basePersona = `당신은 한국 문화의 경조사 예법과 어휘의 품격에 매우 정통한 메시지 작성 전문가입니다.`;

  const relationContext = `
[상대방 및 관계 정보]
- 호칭/이름: ${input.relationship.name}
- 관계 분류: ${input.relationship.relationType}
- 친밀도: ${input.relationship.closeness} / 5 점 (1: 격식있는 원거리, 5: 매우 친밀함)
- 선호 톤앤매너: ${input.relationship.tonePreference}
- 기억 및 관계 맥락: ${input.relationship.memoryNotes && input.relationship.memoryNotes.length > 0 ? input.relationship.memoryNotes.join(', ') : '특이사항 없음'}
`;

  const keywordFragments = input.primaryKeyword
    ? `
[상황 및 선택 키워드]
- 분류: ${input.category}
- 주요 상황: ${input.primaryKeyword.keywordLabel} (${input.primaryKeyword.promptFragment})
- 세부 옵션: ${input.subKeywords.map((k) => `• ${k.keywordLabel}: ${k.promptFragment}`).join('\n')}
`
    : `
[상황 및 선택 키워드]
- 분류: ${input.category}
- 별도로 선택된 주제 키워드 없음 — 아래 [사용자 추가 요청사항]에 적힌 내용만을 근거로 자연스러운 편지를 작성하세요.
`;

  const cautionNotes = [
    input.primaryKeyword?.cautionNote,
    ...input.subKeywords.map((k) => k.cautionNote),
  ]
    .filter(Boolean)
    .join('\n');

  const cautionSection = cautionNotes
    ? `
[⚠️ 금기어 및 문화적 예법 주의사항]
${cautionNotes}
`
    : '';

  const formatRule = getFormatRule(input.format);

  const customNoteSection = input.customInstruction
    ? `
[사용자 추가 요청사항]
${input.customInstruction}
`
    : '';

  return `
${basePersona}

${relationContext}

${keywordFragments}

${cautionSection}

${formatRule}

${customNoteSection}

[요구사항 및 출력 형식]
위 조건과 관계 맥락을 고려하여 서로 다른 매력을 지닌 **3가지(Variant 1, 2, 3)**의 맞춤형 멘안을 작성해주세요.

다음 JSON 형식으로만 응답해주세요:
{
  "candidates": [
    {
      "variantIndex": 1,
      "title": "정중하고 품격 있는 정석형",
      "toneTag": "정중/격식",
      "content": "생성된 멘트 내용",
      "etiquetteTip": "이 멘트를 전달할 때 참고하면 좋은 예법이나 어조 팁 (1문장)"
    },
    {
      "variantIndex": 2,
      "title": "진심이 따스하게 와닿는 감성형",
      "toneTag": "다정/따스함",
      "content": "생성된 멘트 내용",
      "etiquetteTip": "이 멘트를 전달할 때 참고하면 좋은 예법이나 어조 팁 (1문장)"
    },
    {
      "variantIndex": 3,
      "title": "간결하고 세련된 단정형",
      "toneTag": "간결/깔끔",
      "content": "생성된 멘트 내용",
      "etiquetteTip": "이 멘트를 전달할 때 참고하면 좋은 예법이나 어조 팁 (1문장)"
    }
  ]
}
`;
}
