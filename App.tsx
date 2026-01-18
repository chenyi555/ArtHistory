
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icons } from './components/Icons';
import { ERAS, COURSE_DATA } from './data';
import { EraId, Painter, Lesson, LessonReward, BioEvent } from './types';
import { getArtInsight } from './services/geminiService';

// --- Global UI Helpers ---

const PathLine = ({ x1, y1, x2, y2, color }: { x1: number, y1: number, x2: number, y2: number, color: string }) => (
  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
    <path 
      d={`M${x1},${y1} C${x1},${(y1+y2)/2} ${x2},${(y1+y2)/2} ${x2},${y2}`} 
      fill="none" 
      stroke={color} 
      strokeWidth="8" 
      strokeLinecap="round" 
      className="opacity-20" 
    />
  </svg>
);

const AppreciationStars = ({ level = 1, max = 5 }: { level?: number, max?: number }) => (
  <div className="flex flex-col items-center gap-1.5 mb-5 w-full">
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">鉴赏等级</div>
    <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
      {[...Array(max)].map((_, i) => (
        <Icons.Star 
          key={i} 
          size={16} 
          className={i < level ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} 
        />
      ))}
    </div>
  </div>
);

const GeminiInsight = ({ topic }: { topic: string }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const text = await getArtInsight(topic);
    setInsight(text);
    setLoading(false);
  };

  return (
    <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 shadow-sm mb-6 w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 text-white p-1.5 rounded-lg shadow-sm">
            <Icons.Zap size={14} fill="currentColor" />
          </div>
          <span className="text-sm font-black text-purple-900">AI 鉴赏助手</span>
        </div>
        {!insight && !loading && (
          <button 
            onClick={fetchInsight}
            className="text-[10px] font-bold text-purple-600 border border-purple-200 px-3 py-1 rounded-full hover:bg-purple-100"
          >
            获取解读
          </button>
        )}
      </div>
      {loading && <div className="text-xs text-slate-400 animate-pulse">正在生成深度洞察...</div>}
      {insight && <div className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">{insight}</div>}
    </div>
  );
};

// --- Screen Components ---

const StoryScreen = ({ story, onBack }: { story: any, onBack: () => void }) => {
  const storyContent = `
    ${story.title} 是艺术史上的一个重要时刻。
    在这幅作品诞生之前，学院派艺术占据着统治地位。然而，这位艺术家试图打破常规。
    当时巴黎的艺术氛围充满了变革。年轻的画家们渴望走出画室，去描绘瞬息万变的自然光色。
    他没有像往常那样先画素描稿，而是直接用色彩在画布上涂抹。笔触飞快，仿佛在与光线赛跑。
    这幅作品最初展出时，遭受了猛烈抨击。但正是这种对瞬间真实感受的捕捉，开启了现代艺术的大门。
  `;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fdfbf7] animate-in slide-in-from-bottom-10 duration-300 relative overflow-hidden font-serif">
      <div className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-stone-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-stone-600">
          <Icons.X size={24} />
        </button>
        <div className="flex items-center gap-2 text-stone-400">
          <Icons.Scroll size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">艺术故事</span>
        </div>
        <div className="w-8"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        <h1 className="text-3xl font-black text-stone-800 mb-8 leading-tight">{story.title}</h1>
        <div className="prose prose-stone leading-loose text-stone-600 text-justify">
          {storyContent.split('\n').map((paragraph, idx) => (
            paragraph.trim() && <p key={idx} className="mb-6 indent-8">{paragraph.trim()}</p>
          ))}
        </div>
        <div className="flex justify-center mt-16 mb-8 opacity-20">
          <Icons.Scroll size={24} className="text-stone-400" />
        </div>
      </div>
    </div>
  );
};

const PracticeScreen = ({ target, onFinish }: { target: any, onFinish: () => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { text: `关于 ${target.name}，最显著的风格特征是？`, options: ['严谨古典', '光影瞬间', '抽象表现', '极简主义'], answer: 1 },
    { text: '该流派起源于以下哪个国家？', options: ['英国', '法国', '荷兰', '意大利'], answer: 1 },
    { text: '这类作品通常在哪里创作？', options: ['室内画室', '户外写生', '宫廷', '修道院'], answer: 1 },
  ];

  const handleOption = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[currentIdx].answer) setScore(s => s + 1);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white text-center">
        <Icons.Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" fill="currentColor" />
        <h2 className="text-3xl font-black mb-2 text-slate-800">挑战完成!</h2>
        <p className="text-slate-500 mb-10 font-bold">正确率: {Math.round((score / questions.length) * 100)}%</p>
        <button onClick={onFinish} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-[0_4px_0_0_#581c87]">
          返回并领取奖励
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-white">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onFinish}><Icons.X size={28} className="text-slate-300" /></button>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-slate-50 rounded-3xl p-8 mb-8 text-center border-2 border-slate-100 min-h-[160px] flex items-center justify-center">
          <h3 className="text-2xl font-black text-slate-800">{questions[currentIdx].text}</h3>
        </div>
        <div className="space-y-4">
          {questions[currentIdx].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOption(i)}
              className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${
                selected === i 
                  ? (i === questions[currentIdx].answer ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-red-50 border-red-500 text-red-700 shadow-sm')
                  : (selected !== null && i === questions[currentIdx].answer ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 hover:bg-slate-50')
              }`}
            >
              <span>{opt}</span>
              {selected === i && (i === questions[currentIdx].answer ? <Icons.CheckCircle2 size={20} /> : <Icons.X size={20} />)}
            </button>
          ))}
        </div>
      </div>
      {selected !== null && (
        <button onClick={next} className="bg-slate-800 text-white py-4 rounded-2xl font-bold w-full animate-in slide-in-from-bottom-5">
          {currentIdx === questions.length - 1 ? '完成' : '下一步'}
        </button>
      )}
    </div>
  );
};

const PathNode = ({ lesson, schoolColor, borderColor, onClick, xOffset, prevXOffset, isFirst }: any) => {
  const isLocked = lesson.status === 'locked';
  const isActive = lesson.status === 'active';
  const strokeColor = schoolColor.includes('purple') ? '#a855f7' : schoolColor.includes('blue') ? '#3b82f6' : '#cbd5e1';

  return (
    <div className="relative flex justify-center py-2 h-24 w-full">
      {!isFirst && (
        <div className="absolute top-[-50%] left-[50%] w-0 h-full">
          <PathLine x1={prevXOffset} y1={30} x2={xOffset} y2={100} color={strokeColor} />
        </div>
      )}
      <div style={{ transform: `translateX(${xOffset}px)` }} className="relative z-10">
        {isActive && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-purple-600 font-bold text-xs px-3 py-1.5 rounded-xl shadow-md border border-purple-100 animate-bounce flex items-center gap-1 whitespace-nowrap">
            开始挑战
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-purple-100 rotate-45"></div>
          </div>
        )}
        <button 
          onClick={() => !isLocked && onClick(lesson)}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${isLocked ? 'bg-slate-200 border-slate-300' : `${schoolColor} border-b-[5px] ${borderColor} hover:brightness-110 shadow-xl`} active:translate-y-2 active:border-b-0`}
        >
          {lesson.isBoss ? (
            <Icons.Trophy size={28} className={isLocked ? 'text-slate-400' : 'text-yellow-100'} fill={isLocked ? 'none' : '#facc15'} />
          ) : (
            <Icons.Star size={30} className={isLocked ? 'text-slate-400' : 'text-white'} fill={isLocked ? 'none' : 'currentColor'} />
          )}
        </button>
        <div className={`absolute top-[4.5rem] left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-md whitespace-nowrap text-center ${isLocked ? 'text-slate-400' : 'text-slate-700 bg-white/60 backdrop-blur-sm'}`}>
          {lesson.name}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [tab, setTab] = useState<'learn' | 'collection'>('learn');
  const [eraId, setEraId] = useState<EraId>('19th_century');
  const [selectedPainter, setSelectedPainter] = useState<Painter | null>(null);
  const [selectedPainting, setSelectedPainting] = useState<LessonReward | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [activeStory, setActiveStory] = useState<any>(null);
  const [showEraModal, setShowEraModal] = useState(false);

  const era = ERAS[eraId];
  const regions = COURSE_DATA[eraId] || [];

  return (
    <div className="h-full w-full bg-[#1e293b] flex items-center justify-center font-sans">
      <div className="w-full max-w-[375px] h-[812px] bg-[#f0f4f8] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative ring-8 ring-black/20">
        
        {/* Navigation Overlays */}
        {activeStory && (
          <div className="absolute inset-0 z-[110] bg-white">
            <StoryScreen story={activeStory} onBack={() => setActiveStory(null)} />
          </div>
        )}

        {activeQuiz && (
          <div className="absolute inset-0 z-[100] bg-white">
            <PracticeScreen target={activeQuiz} onFinish={() => setActiveQuiz(null)} />
          </div>
        )}

        {selectedPainter && (
          <div className="absolute inset-0 z-[90] bg-slate-50 overflow-y-auto no-scrollbar">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-4 py-3 border-b flex items-center justify-between">
              <button onClick={() => setSelectedPainter(null)} className="p-2 -ml-2"><Icons.ChevronLeft size={24} /></button>
              <h2 className="text-lg font-black">画家档案</h2>
              <div className="w-8"></div>
            </div>
            <div className="p-6 pb-24 flex flex-col items-center">
              <div className="w-48 h-64 rounded-2xl bg-white border-8 border-yellow-400 shadow-2xl flex items-center justify-center text-8xl mb-6 relative">
                {selectedPainter.avatar}
                <div className="absolute top-2 right-2"><Icons.Flame size={24} className="text-orange-500 fill-orange-500 animate-pulse" /></div>
              </div>
              <h1 className="text-3xl font-black mb-1 text-slate-900">{selectedPainter.name}</h1>
              <p className="text-sm font-serif italic text-slate-400 mb-6">{selectedPainter.nameEn}</p>
              
              <GeminiInsight topic={`${selectedPainter.name} - ${selectedPainter.desc}`} />

              <div className="w-full space-y-8">
                <div>
                  <h3 className="text-lg font-extrabold mb-6 border-l-4 border-purple-500 pl-3">生平轨迹</h3>
                  <div className="relative pl-4 border-l-2 border-slate-200 ml-2 space-y-10">
                    {selectedPainter.bioEvents?.map((event, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow-sm"></div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                          <h4 className="font-bold text-slate-800"><span className="text-purple-600 mr-2">{event.year}</span>{event.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{event.desc}</p>
                          <button 
                            onClick={() => setActiveStory(event)}
                            className="flex items-center gap-1.5 text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <Icons.Scroll size={12} /> 更多故事
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold mb-4 border-l-4 border-blue-500 pl-3">代表作</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPainter.levels[0].lessons.map((l, i) => (
                      <div key={i} onClick={() => setSelectedPainting(l.reward)} className="bg-white border border-slate-200 rounded-2xl aspect-[3/4] flex flex-col items-center justify-center p-4 cursor-pointer hover:scale-105 transition-transform shadow-sm">
                        <div className="text-5xl mb-3">{l.reward.image}</div>
                        <div className="text-[10px] font-black text-slate-800 text-center line-clamp-1">{l.reward.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPainting && (
          <div className="absolute inset-0 z-[120] bg-white flex flex-col overflow-y-auto no-scrollbar">
            <div className="px-4 py-3 border-b flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <button onClick={() => setSelectedPainting(null)}><Icons.ChevronLeft size={24} /></button>
              <h2 className="font-black">画作详情</h2>
              <div className="w-8"></div>
            </div>
            <div className="p-8 pb-24 flex flex-col items-center">
              <div className="aspect-[4/5] w-full bg-slate-50 border-4 border-slate-200 rounded-[2.5rem] mb-8 flex items-center justify-center text-9xl shadow-xl shadow-slate-200/50">
                {selectedPainting.image}
              </div>
              <h1 className="text-4xl font-black text-center mb-1 text-slate-900">{selectedPainting.name}</h1>
              <p className="text-sm font-serif italic text-slate-400 text-center mb-8">{selectedPainting.nameEn}</p>
              
              <GeminiInsight topic={`The masterpiece ${selectedPainting.name} and its contribution to Art History`} />

              <div className="grid grid-cols-2 gap-4 w-full mb-10">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider mb-1">年代</span>
                  <span className="font-black text-slate-800">{selectedPainting.year}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider mb-1">收藏地</span>
                  <span className="font-black text-slate-800 line-clamp-1">{selectedPainting.location || '私人收藏'}</span>
                </div>
              </div>

              <button 
                onClick={() => setActiveQuiz(selectedPainting)} 
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_4px_0_0_#581c87] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <Icons.Trophy size={20} /> 开始鉴赏挑战
              </button>
            </div>
          </div>
        )}

        {/* Top Navigation */}
        <div className="flex-none bg-white/95 backdrop-blur-md border-b px-4 py-3 flex justify-between items-center z-50">
          <button 
            onClick={() => setShowEraModal(true)}
            className="flex items-center gap-2 bg-slate-50 pr-3 pl-1 py-1.5 rounded-xl border border-slate-100 shadow-sm transition-transform active:scale-95"
          >
            <div className={`${era.color} w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm`}>
              <Icons.BookOpen size={16} />
            </div>
            <div className="text-left">
              <div className="text-[9px] text-slate-400 font-black uppercase leading-none mb-0.5">当前时代</div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-slate-700">{era.name}</span>
                <Icons.ChevronDown size={10} strokeWidth={4} className="text-slate-400" />
              </div>
            </div>
          </button>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                <Icons.Gem size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-black text-yellow-700">1250</span>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {tab === 'learn' ? (
            regions.map(region => (
              <div key={region.id} className="mb-0">
                <div className="flex items-center gap-2 px-6 mb-2 mt-6">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{region.name} 区域</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                {region.schools.map(school => (
                  <div key={school.id} className="mb-4">
                    <div className={`${school.color} text-white p-5 mx-4 rounded-3xl shadow-lg relative overflow-hidden mb-4`}>
                      <div className="relative z-10">
                        <div className="bg-black/10 inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mb-2">艺术流派</div>
                        <h3 className="text-2xl font-black mb-1">{school.name}</h3>
                        <p className="text-xs opacity-90 font-medium">{school.description}</p>
                      </div>
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                    <div className="flex flex-col gap-8 px-4 pb-12">
                      {school.painters.map(painter => (
                        <div key={painter.id} className="bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm relative overflow-visible">
                          <div className="flex items-start justify-between mb-8 relative z-20">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner border border-slate-100">{painter.avatar}</div>
                              <div>
                                <h4 className="text-lg font-black text-slate-800">{painter.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{painter.desc}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedPainter(painter)}
                              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90"
                            >
                              <Icons.ChevronRight size={18} strokeWidth={3} />
                            </button>
                          </div>
                          <div className="relative min-h-[220px]">
                            {/* Mascot */}
                            <div className="absolute bottom-4 right-2 z-20 flex flex-col items-center">
                              <div className="relative w-16 h-16 group cursor-pointer active:scale-90 transition-transform">
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-8 rounded-t-full ${school.color} shadow-md`}></div>
                                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 text-4xl filter drop-shadow-sm transition-transform ${painter.mascotState === 'waving' ? 'animate-wiggle origin-bottom' : ''}`}>
                                  {painter.avatar}
                                </div>
                                {painter.mascotState === 'waving' && <div className="absolute top-4 -right-2 text-xl animate-wave origin-bottom-left">👋</div>}
                              </div>
                            </div>
                            <div className="flex flex-col pt-2 pb-6">
                              {painter.levels[0].lessons.map((lesson, lIndex) => {
                                const offsets = [0, -35, 35, 0];
                                const x = offsets[lIndex % offsets.length];
                                const prevX = lIndex > 0 ? offsets[(lIndex - 1) % offsets.length] : 0;
                                return (
                                  <PathNode 
                                    key={lesson.id} 
                                    lesson={lesson} 
                                    schoolColor={school.color} 
                                    borderColor={school.borderColor} 
                                    onClick={setActiveQuiz}
                                    xOffset={x}
                                    prevXOffset={prevX}
                                    isFirst={lIndex === 0}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-6 space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                 <Icons.Palette className="text-purple-600" />
                 艺术图鉴
              </h2>
              {regions.flatMap(r => r.schools).map(school => (
                <div key={school.id} className="bg-white rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-lg shadow-slate-200/50">
                   <div className={`${school.color} p-5 text-white flex justify-between items-center relative overflow-hidden`}>
                      <div className="relative z-10">
                        <h3 className="font-black text-lg tracking-tight">{school.name} 套牌</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="h-1.5 w-24 bg-black/20 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400" style={{ width: '45%' }}></div>
                           </div>
                           <span className="text-[10px] font-black opacity-80">45%</span>
                        </div>
                      </div>
                      <Icons.Layers size={24} className="opacity-40" />
                   </div>
                   <div className="p-5 grid grid-cols-3 gap-3 bg-slate-50/50">
                     {school.painters.flatMap(p => p.levels[0].lessons).map((l, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedPainting(l.reward)} 
                          className={`aspect-[2/3] bg-white rounded-2xl border-2 flex flex-col items-center justify-center p-2 cursor-pointer hover:scale-95 active:scale-90 transition-all ${l.status === 'completed' ? 'border-slate-100 shadow-sm' : 'border-slate-50 opacity-40 grayscale'}`}
                        >
                           {l.status === 'completed' ? (
                             <>
                               <div className="text-4xl mb-3 drop-shadow-sm">{l.reward.image}</div>
                               <div className="text-[9px] font-black text-slate-500 line-clamp-1 text-center">{l.reward.name}</div>
                             </>
                           ) : <Icons.Lock size={20} className="text-slate-300" />}
                        </div>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Tab Bar */}
        <div className="flex-none bg-white border-t px-10 py-5 flex justify-around items-center z-50">
          <button 
            onClick={() => setTab('learn')} 
            className={`flex flex-col items-center gap-1.5 transition-all ${tab === 'learn' ? 'text-purple-600 scale-110' : 'text-slate-300'}`}
          >
            <Icons.Home size={26} strokeWidth={tab === 'learn' ? 3 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${tab === 'learn' ? 'block' : 'hidden'}`}>学习</span>
          </button>
          <button 
            onClick={() => setTab('collection')} 
            className={`flex flex-col items-center gap-1.5 transition-all ${tab === 'collection' ? 'text-purple-600 scale-110' : 'text-slate-300'}`}
          >
            <Icons.Palette size={26} strokeWidth={tab === 'collection' ? 3 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${tab === 'collection' ? 'block' : 'hidden'}`}>图鉴</span>
          </button>
        </div>

        {/* Era Selector Modal */}
        {showEraModal && (
          <div className="absolute inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex flex-col pt-20 px-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-white text-4xl font-black tracking-tight">选择时代</h2>
              <button onClick={() => setShowEraModal(false)} className="p-2 bg-white/10 rounded-full text-white"><Icons.X size={28} /></button>
            </div>
            <div className="space-y-5">
              {Object.values(ERAS).map(e => (
                <button
                  key={e.id}
                  onClick={() => { setEraId(e.id as EraId); setShowEraModal(false); }}
                  className={`w-full p-8 rounded-[2.5rem] text-left border-b-8 transition-all active:scale-95 ${eraId === e.id ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 text-white/50 border-slate-950 hover:bg-slate-800/80'}`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">{e.range}</div>
                  <div className="text-3xl font-black">{e.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
