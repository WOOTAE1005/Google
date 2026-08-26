import { BuildPromptInput, MessageFormat } from '../types';

export function getFormatRule(format: MessageFormat): string {
  switch (format) {
    case '문자':
      return `
Format Rule [문자 (SMS/LMS)]:
- 3~5문장 (100~200자 내외)의 단정하고 완결성 있는 메시지입니다.
- 첫인사 - 본론(축하/조의/쾌유의 마음) - 상대방의 안녕과 기원을 바라는 마무리가 깔끔하게 어우러지도록 작성하세요.
- 모바일 문자로 읽기 편한 줄바꿈과 어조를 유지하세요.
`;
    case '카카오톡메시지':
      return `
Format Rule [카카오톡메시지]:
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

  // 수신자 등록은 선택사항 — 등록하지 않았다면 특정 인물 정보 없이, 아래
  // 상황/주제/추가 요청사항만으로 무난하고 부담 없는 톤을 스스로 판단하도록
  // 안내한다 (letterAudienceType이 있다면 그쪽이 대상 성격의 유일한 단서가 됨).
  const relationContext = input.relationship
    ? `
[상대방 및 관계 정보]
- 호칭/이름: ${input.relationship.name}
- 관계 분류: ${input.relationship.relationType}
- 친밀도: ${input.relationship.closeness} / 5 점 (1: 격식있는 원거리, 5: 매우 친밀함)
- 선호 톤앤매너: ${input.relationship.tonePreference}
- 기억 및 관계 맥락: ${input.relationship.memoryNotes && input.relationship.memoryNotes.length > 0 ? input.relationship.memoryNotes.join(', ') : '특이사항 없음'}
`
    : `
[상대방 및 관계 정보]
- 별도로 등록된 수신자 정보 없음 — 특정 이름이나 호칭을 지어내지 말고, 아래 상황/주제/추가 요청사항만을 근거로 무난하고 부담 없이 통용될 수 있는 톤으로 작성하세요.
`;

  // 일반편지(category === '편지')는 대분류/주요항목/세부태그 2단 구조가 없는
  // 단일 계층 목록이라, primaryKeyword+subKeywords를 "선택된 편지 주제들"
  // 하나로 합쳐 나열한다 (App.tsx가 복수 선택된 주제 중 첫 번째를
  // primaryKeyword, 나머지를 subKeywords 자리에 실어 보냄).
  const letterTopics = input.category === '편지'
    ? [input.primaryKeyword, ...input.subKeywords].filter(
        (k): k is NonNullable<typeof k> => Boolean(k)
      )
    : [];

  // 일반편지에서 대분류/중분류로 고른 "이 편지가 그려야 할 대상 성격" — 실제
  // 등록된 relationship.relationType과는 별개 신호. 수신자를 등록하지 않고
  // 편지만 쓰거나, 등록된 관계와 다른 맥락으로 쓰고 싶을 때를 위한 값이라
  // 명시돼 있으면 실제 관계 정보보다 이쪽을 우선 참고하도록 안내한다.
  const audienceNote = input.letterAudienceType
    ? `- 이 편지가 그려야 할 대상 성격: ${input.letterAudienceType} (위 [상대방 및 관계 정보]의 관계 분류와 다르다면, 이 편지 작성 시에는 이 항목을 우선 참고하세요)\n`
    : '';

  const keywordFragments =
    input.category === '편지'
      ? letterTopics.length > 0
        ? `
[상황 및 선택 키워드]
${audienceNote}- 선택된 편지 주제 (${letterTopics.length}개): ${letterTopics.map((k) => `${k.keywordLabel}(${k.promptFragment})`).join(', ')}
- 여러 주제가 선택된 경우, 하나의 편지 안에 그 정서들을 자연스럽게 함께 녹여내세요.
`
        : `
[상황 및 선택 키워드]
${audienceNote}- 별도로 선택된 주제 키워드 없음 — 아래 [사용자 추가 요청사항]에 적힌 내용만을 근거로 자연스러운 편지를 작성하세요.
`
      : input.primaryKeyword
      ? `
[상황 및 선택 키워드]
- 분류: ${input.category}
- 주요 상황: ${input.primaryKeyword.keywordLabel} (${input.primaryKeyword.promptFragment})
- 세부 옵션: ${input.subKeywords.map((k) => `• ${k.keywordLabel}: ${k.promptFragment}`).join('\n')}
`
      : input.category !== '미지정'
      ? `
[상황 및 선택 키워드]
- 분류: ${input.category}
- 별도로 선택된 주제 키워드 없음 — 아래 [사용자 추가 요청사항]에 적힌 내용만을 근거로 자연스러운 편지를 작성하세요.
`
      : `
[상황 및 선택 키워드]
- 별도로 선택된 대분류/주제 키워드 없음 — 아래 [사용자 추가 요청사항]에 적힌 내용만을 근거로, 경사(축하)인지 조사(위로)인지부터 스스로 판단하여 상황에 맞는 자연스러운 메시지를 작성하세요.
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
