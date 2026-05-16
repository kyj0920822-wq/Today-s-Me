import { useState, useMemo, useEffect } from 'react';
import { DailyStatus } from './types';
import { getDetailedCharacterConfig, getStateKoreanName } from './lib/utils';
import Character from './components/Character';
import InputForm from './components/InputForm';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Heart, Sparkles, CreditCard, Save, History, Trash2, Share2 } from 'lucide-react';
import HistoryShareCard from './components/HistoryShareCard';

const INITIAL_STATUS: DailyStatus = {
  userId: '',
  sleepHours: 7,
  mood: 'neutral',
  meal: 'good',
  socialEnergy: 'balanced',
  fatigue: 'medium',
  hunger: 'low',
  studyAmount: 'medium',
  date: new Date().toISOString().split('T')[0],
  updatedAt: null,
  characterType: 'neutral',
  description: '평범한 하루네요.',
  energyPercent: 50
};

export default function App() {
  const [status, setStatus] = useState<DailyStatus>(INITIAL_STATUS);
  const [history, setHistory] = useState<DailyStatus[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showHistoryShare, setShowHistoryShare] = useState(false);
  const [sharedStatus, setSharedStatus] = useState<DailyStatus | null>(null);

  const characterConfig = useMemo(() => getDetailedCharacterConfig(status), [status]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('moodHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(history));
  }, [history]);

  const handleSave = () => {
    const newRecord = { 
      ...status, 
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setHistory([newRecord, ...history]);
    alert('감정이 기록되었습니다! 보관소 버튼을 눌러 확인해 보세요.');
  };

  const deleteRecord = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen font-sans bg-orange-50/50 pb-24">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 bg-white/70 backdrop-blur-md z-30 border-b border-orange-100 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">나</div>
          <h1 className="font-gaegu text-2xl font-bold tracking-tight text-slate-800">오늘의 나</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-24 px-6 space-y-12">
        <section className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-2"
            >
              <h2 className="text-lg font-gaegu font-bold tracking-tight" style={{ color: characterConfig.secondaryColor + '88' }}>
                오늘 넌 어떤 캐릭터야?
              </h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-1 font-bold rounded-full mb-4 border shadow-sm"
              style={{ 
                backgroundColor: characterConfig.primaryColor + '22', 
                color: characterConfig.secondaryColor,
                borderColor: characterConfig.secondaryColor + '33'
              }}
            >
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[12px] uppercase tracking-widest font-mono">Today's</span>
            </motion.div>

            <motion.div
              key={characterConfig.state}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-10 w-full"
            >
              <h3 className="text-4xl md:text-5xl font-gaegu font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: characterConfig.secondaryColor }}>
                {getStateKoreanName(status)}
              </h3>
            </motion.div>

            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <Character config={characterConfig} />
              </div>

              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex gap-4 w-full">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSharedStatus(null); // Use current status
                      setShowShareCard(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-3 px-4 py-3.5 bg-indigo-500 text-white rounded-[2rem] font-bold font-gaegu text-xl shadow-xl shadow-indigo-100 transition-all"
                  >
                    <CreditCard size={20} />
                    공유 카드 만들기
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-3 px-4 py-3.5 bg-emerald-500 text-white rounded-[2rem] font-bold font-gaegu text-xl shadow-xl shadow-emerald-100 transition-all"
                  >
                    <Save size={20} />
                    기록 공간에 담기
                  </motion.button>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-600 border border-slate-200 rounded-[2rem] font-bold font-gaegu text-2xl shadow-sm transition-all hover:bg-slate-50"
                >
                  <History size={24} className="text-indigo-400" />
                  기록 보관소 {showHistory ? '닫기' : '보기'} ({history.length})
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* History Section - Now Toggled */}
        <AnimatePresence>
          {showHistory && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden"
            >
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-gaegu text-3xl font-bold flex items-center gap-2 text-slate-700 mb-4">
                  <History size={24} className="text-indigo-400" />
                  기록된 감정들
                </h3>
                {history.length > 0 && (
                  <button 
                    onClick={() => setShowHistoryShare(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold font-gaegu text-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm mb-6"
                  >
                    <Share2 size={20} />
                    보관소 전체 기록 공유하기
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="bg-white/50 border-2 border-dashed border-slate-200 p-12 rounded-[40px] text-center text-slate-400 font-gaegu text-xl">
                    아직 기록된 감정이 없어요.<br />나의 첫 번째 캐릭터를 기록해봐요!
                  </div>
                ) : (
                  history.map((record) => (
                    <HistoryItem 
                      key={record.id} 
                      record={record} 
                      onDelete={() => deleteRecord(record.id!)} 
                    />
                  ))
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Input Form Section */}
        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-orange-100 mb-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-orange-50">
            <h3 className="font-gaegu text-2xl font-bold flex items-center gap-2 text-slate-700">
              <Calendar size={20} className="text-indigo-400" />
              오늘의 상태
            </h3>
            <span className="text-xs text-slate-400 font-mono italic">{status.date}</span>
          </div>
          <InputForm status={status} onChange={setStatus} />
        </section>
      </main>

      <AnimatePresence>
        {showShareCard && (
          <ShareCard 
            status={sharedStatus || status} 
            config={getDetailedCharacterConfig(sharedStatus || status)} 
            onClose={() => {
              setShowShareCard(false);
              setSharedStatus(null);
            }} 
          />
        )}

        {showHistoryShare && (
          <HistoryShareCard 
            history={history} 
            onClose={() => setShowHistoryShare(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HistoryItem({ record, onDelete }: { record: DailyStatus, onDelete: () => void }) {
  const config = getDetailedCharacterConfig(record);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4 flex-1">
        <div 
          className="w-12 h-12 flex items-center justify-center shrink-0" 
        >
          <div className="scale-[0.2]">
            <Character config={config} />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 block">
            {record.date} {record.timestamp ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
          </span>
          <h4 className="font-gaegu text-xl font-bold" style={{ color: config.secondaryColor }}>
            {getStateKoreanName(record)}
          </h4>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={onDelete}
          className="p-2.5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
