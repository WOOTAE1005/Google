import React, { useState } from 'react';
import { BookOpen, X, Check, Copy, HelpCircle } from 'lucide-react';

interface EtiquetteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EtiquetteModal: React.FC<EtiquetteModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'envelope' | 'cash' | 'kakao' | 'dress'>('envelope');
  const [copiedHanji, setCopiedHanji] = useState<string | null>(null);

  if (!isOpen) return null;

  const hanjiList = [
    { title: '결혼 (신랑 측)', kanji: '祝結婚', hangeul: '축결혼', desc: '신랑 측에 축의금을 전달할 때 가장 보편적인 표기' },
    { title: '결혼 (신부 측)', kanji: '祝華婚', hangeul: '축화혼', desc: '신부 측에 축의금을 전달할 때 아름다운 결혼을 축하하는 표기' },
    { title: '부고 / 상가', kanji: '謹弔', hangeul: '근조', desc: '삼가 조의를 표할 때 쓰이는 보편적인 부의금 봉투 표기' },
    { title: '부고 / 상가', kanji: '賻儀', hangeul: '부의', desc: '상가에 내는 돈이나 물품 봉투에 적는 전통 표기' },
    { title: '돌 / 환갑 / 칠순', kanji: '祝壽福', hangeul: '축수복', desc: '장수와 복을 기원하는 축하 봉투 표기' },
    { title: '개업 / 이전', kanji: '祝發展', hangeul: '축발전', desc: '사업의 무궁한 발전을 기원할 때 적는 표기' },
  ];

  const handleCopyHanji = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHanji(text);
    setTimeout(() => setCopiedHanji(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border border-stone-200 text-stone-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-stone-900">
                경조사 봉투 작성법 & 예법 가이드
              </h2>
              <p className="text-xs text-stone-500">한자 표기, 봉투 기입 위치, 액수 매너 안내</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap bg-[#F3EFE6] p-1.5 border-b border-stone-200 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('envelope')}
            className={`flex-1 min-w-[120px] py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'envelope'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ✉️ 봉투 한자 & 위치
          </button>
          <button
            onClick={() => setActiveTab('cash')}
            className={`flex-1 min-w-[120px] py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'cash'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            💵 액수 단위 예법
          </button>
          <button
            onClick={() => setActiveTab('dress')}
            className={`flex-1 min-w-[120px] py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dress'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            👔 하객/조문 의상 예절
          </button>
          <button
            onClick={() => setActiveTab('kakao')}
            className={`flex-1 min-w-[120px] py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'kakao'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📲 카톡/모바일 송금
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'envelope' && (
            <div className="space-y-5">
              {/* Envelope Diagram Graphic comparing Celebration vs Condolence */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-amber-200/80 space-y-3">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-700" /> 경사 vs 조사 봉투 작성 위치 비교
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* 경사 봉투 (축의금) */}
                  <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-2xs space-y-2">
                    <div className="text-[11px] text-amber-800 font-bold border-b border-amber-100 pb-1 flex items-center justify-between">
                      <span>🎉 경사 (결혼, 돌, 개업 등)</span>
                      <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">축의금</span>
                    </div>
                    <div className="space-y-1.5 text-left text-[11px]">
                      <div>
                        <span className="font-bold text-stone-900">· 앞면 중앙:</span> 축하 한자/문구 (祝結婚, 祝發展)
                      </div>
                      <div>
                        <span className="font-bold text-stone-900">· 뒷면 좌측하단:</span> 소속 + 이름 + <b>'올림/拜上/드림'</b>
                      </div>
                      <div className="p-2 bg-amber-50/50 rounded-lg text-[10px] text-stone-600 font-serif">
                        예시: [앞] 祝結婚 / [뒤] OO상사 홍길동 드림
                      </div>
                    </div>
                  </div>

                  {/* 조사 봉투 (부의금) */}
                  <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-2xs space-y-2">
                    <div className="text-[11px] text-slate-800 font-bold border-b border-slate-100 pb-1 flex items-center justify-between">
                      <span>🌿 조사 (부고, 장례식 등)</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">조의금</span>
                    </div>
                    <div className="space-y-1.5 text-left text-[11px]">
                      <div>
                        <span className="font-bold text-stone-900">· 앞면 중앙:</span> 조의 한자 (謹弔, 賻儀, 追悼)
                      </div>
                      <div>
                        <span className="font-bold text-stone-900">· 뒷면 좌측하단:</span> 소속 + <b>성함만 단정히 기재</b><br />
                        <span className="text-amber-800 text-[10px] font-semibold">※ 조의 봉투엔 '드림/올림'을 붙이지 않는 것이 전통 예법!</span>
                      </div>
                      <div className="p-2 bg-slate-50/60 rounded-lg text-[10px] text-slate-700 font-serif">
                        예시: [앞] 謹弔 / [뒤] OO상사 김철수
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hanji list */}
              <div>
                <div className="text-xs font-bold text-stone-700 mb-2.5">
                  주요 경조사 봉투 한자 표기 (원클릭 복사)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {hanjiList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-300 transition-all flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-stone-900">{item.kanji}</span>
                          <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">{item.hangeul}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyHanji(item.kanji)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedHanji === item.kanji ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        복사
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cash' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  💡 홀수(3, 5, 7, 10...) 단위의 봉투 액수 법칙
                </div>
                <p className="text-stone-700 text-xs leading-relaxed">
                  음양오행설에서 홀수(3, 5, 7)는 긍정적인 '양(陽)'의 기운을 뜻하여 경조사금은 주로 홀수 단위로 맞춥니다.<br />
                  10만원, 20만원, 30만원은 10이 3과 7이 합쳐진 완벽한 숫자로 여겨져 홀수로 간주합니다.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 text-xs">🎉 축의금 전달 매너</div>
                  <ul className="list-disc list-inside text-xs text-stone-600 space-y-1 pl-1">
                    <li>되도록 조폐공사에서 발행된 깨끗한 <b>신권(新券)</b>을 준비합니다.</li>
                    <li>봉투 입구는 접거나 풀칠하지 않고 자연스럽게 닫아 전달합니다.</li>
                    <li>방명록을 작성한 후 축의금 봉투를 제출하고 식권을 수령합니다.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 text-xs">🌿 조의금(부의금) 전달 매너</div>
                  <ul className="list-disc list-inside text-xs text-stone-600 space-y-1 pl-1">
                    <li>화려하거나 화려한 무늬가 있는 봉투는 피하고 <b>단정한 흰 봉투</b>를 사용합니다.</li>
                    <li>지폐의 전면(인물 얼굴이 있는 쪽)이 봉투 안쪽을 향하도록 넣는 것이 기본 예의입니다.</li>
                    <li>조문록을 작성한 뒤 상주와 묵념/절을 올린 후 조의금을 전달합니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dress' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {/* 결혼식 하객 의상 */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  🎉 결혼식 하객 의상 예절 (하객룩 매너)
                </div>
                <div className="space-y-2 text-xs text-stone-700">
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900">· [핵심] 신부 배려 (올화이트 금지):</span><br />
                    순백색(올화이트) 원피스, 드레스, 화이트 투피스는 주인공인 신부를 위해 반드시 피하는 것이 매너입니다.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900">· 권장 스타일에:</span><br />
                    단정한 톤다운 단색 정장, 내추럴 톤(베이지, 딥블루, 네이비, 파스텔) 원피스, 슬랙스 & 블라우스/셔츠 조합.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900">· 주의할 옷:</span><br />
                    지나친 노출 의상, 화려한 호피/형광원색, 트레이닝복이나 슬리퍼.
                  </div>
                </div>
              </div>

              {/* 장례식 조문 의상 */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  🌿 장례식 조문객 의상 예절 (조문 복장)
                </div>
                <div className="space-y-2 text-xs text-stone-700">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">· [핵심] 어두운 단색 무채색:</span><br />
                    검정색(Black)이 기본이며, 무채색(다크네이비, 쥐색, 딥그레이) 계열의 단정한 옷을 입습니다.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">· [필수] 양말 / 스타킹 착용:</span><br />
                    조문 시 절을 올리므로 <b>맨발이 드러나지 않도록</b> 반드시 어두운색 양말이나 스타킹을 착용해야 합니다.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">· 피해야 할 항목:</span><br />
                    반바지, 샌들/슬리퍼, 화려한 액세서리/금속 장식, 원색/반짝이 소재 의상.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kakao' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#fee500]/20 border border-amber-300 space-y-2">
                <div className="font-bold text-stone-900 text-sm">
                  📲 모바일 송금 & 카카오톡 메시지 에티켓
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  불가피하게 참석하지 못해 모바일 송금(카카오페이/토스/계좌이체)을 하실 때에는, 송금만 달랑 보내기보다 <b>정성스런 안부 문구와 함께 송금 사실을 다정하게 안내</b>해 드리는 것이 가장 기분 좋은 매너입니다.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2">
                <div className="font-bold text-stone-900 text-xs">권장 전달 문구 예시:</div>
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 font-sans italic">
                  "OO님, 마음에 깊이 축하/애도를 표하며 직접 찾아뵙지 못해 송구한 마음입니다. 마음을 담아 작은 성의를 함께 보냅니다. 모쪼록 뜻깊고 평안한 하루 되시길 바랍니다."
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-[#FAF7F2] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
