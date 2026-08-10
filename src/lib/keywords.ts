import { PromptKeyword, OccasionCategory } from '../types';

export const PROMPT_KEYWORDS: PromptKeyword[] = [
  // ==================== 경사 (Celebrations) ====================
  // 1. 결혼
  {
    id: 'k-wedding-primary',
    category: '경사',
    keywordType: 'primary',
    keywordLabel: '결혼',
    promptFragment: '새로운 출발을 시작하는 두 사람의 신랑 신부에게 아름다운 축복과 기쁨을 전달합니다.',
  },
  {
    id: 'k-wedding-sub-1',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '하객 직접 참석',
    parentKeywordId: 'k-wedding-primary',
    promptFragment: '결혼식 현장에 직접 참석하여 두 사람의 앞날을 마음 깊이 축하하고 함께 기뻐하겠다는 내용을 포함합니다.',
  },
  {
    id: 'k-wedding-sub-2',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '참석 못함 (축의금 전달)',
    parentKeywordId: 'k-wedding-primary',
    promptFragment: '부득이하게 사정상 직접 찾아가지 못해 아쉬운 마음을 전하고, 축복의 마음과 함께 축의금을 마음으로 전달한다는 내용을 다정하게 녹여냅니다.',
  },
  {
    id: 'k-wedding-sub-3',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '직장 상사/동료 결혼',
    parentKeywordId: 'k-wedding-primary',
    promptFragment: '직장에서 함께 일하며 쌓은 존경과 신뢰를 담아, 일터에서의 멋진 모습만큼 가정에서도 행복이 가득하기를 기원하는 품격 있는 메시지를 구성합니다.',
  },
  {
    id: 'k-wedding-sub-4',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '재혼 (새로운 출발)',
    parentKeywordId: 'k-wedding-primary',
    promptFragment: '새로운 시작을 맞이하는 성숙한 원숙함과 진정한 행복을 진심으로 응원하는 기쁨을 표현합니다.',
    cautionNote: '굳이 "재혼"이라는 단어를 직접적으로 언급하지 마세요. 일반적인 결혼 축하와 동일하게 자연스럽고 따뜻한 새로운 행복을 축복해주세요.',
  },

  // 2. 출산
  {
    id: 'k-baby-primary',
    category: '경사',
    keywordType: 'primary',
    keywordLabel: '출산',
    promptFragment: '새 생명의 탄생이라는 큰 경사를 맞이한 부모와 아이에게 따스한 축하와 축복을 전합니다.',
  },
  {
    id: 'k-baby-sub-1',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '첫 아이 탄생',
    parentKeywordId: 'k-baby-primary',
    promptFragment: '부모가 된 경이롭고 기쁜 순간을 축하하며, 아이와 함께 시작할 설레고 소중한 날들을 축복합니다.',
  },
  {
    id: 'k-baby-sub-2',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '순산 & 산모 건강 기원',
    parentKeywordId: 'k-baby-primary',
    promptFragment: '산모의 건강한 회복과 무사 순산을 온 마음으로 감사하며, 아이와 산모 모두의 평안을 기원합니다.',
  },
  {
    id: 'k-baby-sub-3',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '둘째 이상 탄생',
    parentKeywordId: 'k-baby-primary',
    promptFragment: '가족이 더욱 풍성해지고 행복이 배가 된 기쁜 경사를 축하합니다.',
  },

  // 3. 승진/영전
  {
    id: 'k-promotion-primary',
    category: '경사',
    keywordType: 'primary',
    keywordLabel: '승진 · 영전',
    promptFragment: '그동안의 노력과 성과가 결실을 맺은 승진 및 영전을 진심으로 축하하며 축원합니다.',
  },
  {
    id: 'k-promotion-sub-1',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '임원/주요 보직 승진',
    parentKeywordId: 'k-promotion-primary',
    promptFragment: '리더십과 지혜를 발휘하여 승진하신 것에 격식과 예우를 갖추어 깊은 존경과 축하를 표합니다.',
  },
  {
    id: 'k-promotion-sub-2',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '탁월한 성과 격려',
    parentKeywordId: 'k-promotion-primary',
    promptFragment: '묵묵히 흘린 땀방울과 탁월한 역량이 빛을 발한 순간임을 강조하며 앞으로의 승승장구를 기원합니다.',
  },

  // 4. 개업/창업
  {
    id: 'k-business-primary',
    category: '경사',
    keywordType: 'primary',
    keywordLabel: '개업 · 창업',
    promptFragment: '새로운 도전을 위해 문을 연 사업장의 번창과 대박을 기원하는 응원의 멘트를 전달합니다.',
  },
  {
    id: 'k-business-sub-1',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '첫 창업 응원',
    parentKeywordId: 'k-business-primary',
    promptFragment: '용기 있는 시작에 깊은 박수를 보내며, 준비한 만큼 큰 결실과 성장이 함께하기를 기원합니다.',
  },
  {
    id: 'k-business-sub-2',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '확장 이전 축하',
    parentKeywordId: 'k-business-primary',
    promptFragment: '더 큰 도약을 향해 매장을 확장 이전한 성과를 축하하며, 손님과 웃음이 끊이지 않기를 진심으로 바랍니다.',
  },

  // 5. 생일/수연 (환갑/칠순/돌잔치)
  {
    id: 'k-birthday-primary',
    category: '경사',
    keywordType: 'primary',
    keywordLabel: '환갑 · 칠순 · 돌잔치',
    promptFragment: '인생의 뜻깊은 마일스톤(환갑, 칠순, 첫돌 등)을 맞이하여 온 가족의 건강과 기쁨을 기원합니다.',
  },
  {
    id: 'k-birthday-sub-1',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '환갑/칠순/팔순 (장수 기원)',
    parentKeywordId: 'k-birthday-primary',
    promptFragment: '지혜롭게 삶을 가꾸어 오신 어르신께 머리 숙여 깊은 감사와 함께 무병장수 및 만수무강을 축원합니다.',
  },
  {
    id: 'k-birthday-sub-2',
    category: '경사',
    keywordType: 'sub',
    keywordLabel: '첫돌 축하',
    parentKeywordId: 'k-birthday-primary',
    promptFragment: '지난 1년간 탈 없이 밝고 건강하게 자란 아기의 첫 번째 생일을 축하하며 축복이 넘치길 바랍니다.',
  },

  // ==================== 조사 (Condolences) ====================
  // 1. 부고
  {
    id: 'k-condolence-primary',
    category: '조사',
    keywordType: 'primary',
    keywordLabel: '부고 (상가)',
    promptFragment: '갑작스러운 슬픔을 겪은 유가족분들께 삼가 고인의 명복을 빌며 마음 깊은 조의와 애도를 표합니다.',
    cautionNote: '절대로 "호상입니다", "다행입니다"와 같이 오해의 여지가 있는 단어는 사용하지 마세요. 감정을 과장하지 않고 진중하며 담백하고 정중한 존댓말을 사용하세요.',
  },
  {
    id: 'k-condolence-sub-1',
    category: '조사',
    keywordType: 'sub',
    keywordLabel: '부모상 (부친상/모친상)',
    parentKeywordId: 'k-condolence-primary',
    promptFragment: '어버이를 여읜 슬픔과 허전함은 그 무엇으로도 가눌 수 없음을 아는 만큼, 따뜻한 위로와 조의를 전합니다.',
    cautionNote: '부모님을 여읜 깊은 상실감을 존중하며 성급히 기운 내라는 당부보다는 슬픔을 함께 나눈다는 진정성 있는 표현에 집중하세요.',
  },
  {
    id: 'k-condolence-sub-2',
    category: '조사',
    keywordType: 'sub',
    keywordLabel: '배우자상 / 자녀상',
    parentKeywordId: 'k-condolence-primary',
    promptFragment: '가장 아끼는 이를 먼저 보낸 가슴 찢어지는 슬픔에 깊은 안타까움을 전하며 명복을 기원합니다.',
    cautionNote: '상심이 극심할 상주를 위해 대단히 정중하고 절제된 표현으로 온 정성을 다해 조의를 표하세요.',
  },
  {
    id: 'k-condolence-sub-3',
    category: '조사',
    keywordType: 'sub',
    keywordLabel: '조부모상',
    parentKeywordId: 'k-condolence-primary',
    promptFragment: '늘 따뜻한 사랑을 주시던 조부모님의 은혜를 기억하며, 고인이 편안한 곳에서 안식하시기를 삼가 비옵니다.',
  },
  {
    id: 'k-condolence-sub-4',
    category: '조사',
    keywordType: 'sub',
    keywordLabel: '직접 조문 참석 예정',
    parentKeywordId: 'k-condolence-primary',
    promptFragment: '직접 찾아뵙고 조문하여 고인께 인사드리고 슬픔을 함께 나누겠다는 뜻을 전달합니다.',
  },
  {
    id: 'k-condolence-sub-5',
    category: '조사',
    keywordType: 'sub',
    keywordLabel: '부득이한 부조문 (문자/마음만 전함)',
    parentKeywordId: 'k-condolence-primary',
    promptFragment: '사정이 있어 직접 찾아뵙지 못하는 죄송한 마음을 안고, 삼가 조의금과 함께 멀리서나마 고인의 명복을 빕니다.',
  },

  // 2. 문병/쾌유
  {
    id: 'k-sick-primary',
    category: '조사',
    keywordType: 'primary',
    keywordLabel: '문병 · 쾌유',
    promptFragment: '뜻하지 않은 병환이나 사고로 고통받는 분께 조속한 회복과 쾌유를 염원하는 마음을 담습니다.',
    cautionNote: '병세에 관해 가볍게 평하거나 검증되지 않은 조언을 하지 마세요. 오직 마음 편히 휴식하고 조속히 건강을 되찾으시길 바라는 응원에 집중하세요.',
  },
  {
    id: 'k-sick-sub-1',
    category: '조사',
    keywordType: 'sub',
    keywordLabel: '수술 / 입원 경과',
    parentKeywordId: 'k-sick-primary',
    promptFragment: '힘든 수술을 무사히 마치고 치료에 전념 중이신 것에 위로를 전하며, 아무 걱정 없이 충분한 휴식을 취하시길 바랍니다.',
  },
  {
    id: 'k-sick-sub-2',
    category: '조사',
    keywordType: 'sub',
    keywordLabel: '빠른 건강 회복 기원',
    parentKeywordId: 'k-sick-primary',
    promptFragment: '하루빨리 털고 일어나 늘 밝고 건강하셨던 모습으로 다시 만나뵙기를 온 마음으로 기다립니다.',
  },
];

export function getPrimaryKeywords(category: OccasionCategory): PromptKeyword[] {
  return PROMPT_KEYWORDS.filter(
    (k) => k.category === category && k.keywordType === 'primary'
  );
}

export function getSubKeywords(primaryKeywordId: string): PromptKeyword[] {
  return PROMPT_KEYWORDS.filter(
    (k) => k.keywordType === 'sub' && k.parentKeywordId === primaryKeywordId
  );
}
