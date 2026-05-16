import { DailyStatus, Mood, MealQuality, SocialEnergy, Level } from '../types';
import { Moon, Sun, Coffee, Users, Smile, Meh, Frown, Angry, BatteryLow } from 'lucide-react';
import { cn } from '../lib/utils';

interface InputFormProps {
  status: DailyStatus;
  onChange: (newStatus: DailyStatus) => void;
}

export default function InputForm({ status, onChange }: InputFormProps) {
  const handleChange = (field: keyof DailyStatus, value: any) => {
    onChange({ ...status, [field]: value });
  };

  return (
    <div className="space-y-8 p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm">
      {/* Sleep Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-slate-600 font-medium">
          <Moon size={18} />
          <span>수면 시간: {status.sleepHours}시간</span>
        </div>
        <input
          type="range"
          min="0"
          max="12"
          step="0.5"
          value={status.sleepHours}
          onChange={(e) => handleChange('sleepHours', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-mono">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
        </div>
      </section>

      {/* Mood Section */}
      <section>
        <label className="block text-slate-700 font-bold mb-4 font-gaegu text-2xl">현재 기분</label>
        <div className="grid grid-cols-5 gap-3">
          {(['happy', 'neutral', 'sad', 'angry', 'exhausted'] as Mood[]).map((m) => (
            <button
              key={m}
              onClick={() => handleChange('mood', m)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[2rem] border-2 transition-all hover:scale-105 active:scale-95",
                status.mood === m 
                  ? "bg-indigo-50 border-indigo-400 text-indigo-600 shadow-md" 
                  : "bg-white border-slate-100 text-slate-400"
              )}
            >
              <MoodIcon mood={m} />
              <span className="text-sm mt-2 font-bold font-gaegu">{translateMood(m)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Meal Section */}
      <section>
        <label className="block text-slate-700 font-bold mb-4 font-gaegu text-2xl">식사 퀄리티</label>
        <div className="grid grid-cols-4 gap-3">
          {(['poor', 'fair', 'good', 'perfect'] as MealQuality[]).map((mq) => (
            <button
              key={mq}
              onClick={() => handleChange('meal', mq)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[2rem] border-2 transition-all hover:scale-105 active:scale-95",
                status.meal === mq 
                  ? "bg-emerald-50 border-emerald-400 text-emerald-600 shadow-md" 
                  : "bg-white border-slate-100 text-slate-400"
              )}
            >
              <Coffee size={24} />
              <span className="text-sm mt-2 font-bold font-gaegu">{translateMeal(mq)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Social Energy */}
      <section>
        <label className="block text-slate-700 font-bold mb-4 font-gaegu text-2xl">사회적 에너지</label>
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {(['drained', 'low', 'balanced', 'chilling', 'high'] as SocialEnergy[]).map((se) => (
            <button
              key={se}
              onClick={() => handleChange('socialEnergy', se)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[2rem] border-2 transition-all hover:scale-105 active:scale-95",
                status.socialEnergy === se 
                  ? "bg-purple-50 border-purple-400 text-purple-600 shadow-md" 
                  : "bg-white border-slate-100 text-slate-400"
              )}
            >
              <Users size={24} />
              <span className="text-sm mt-2 font-bold font-gaegu">{translateSocial(se)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Levels: Fatigue, Hunger, Study */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LevelSelector 
          label="피로도" 
          value={status.fatigue} 
          onChange={(v) => handleChange('fatigue', v)} 
          color="orange"
        />
        <LevelSelector 
          label="배고픔" 
          value={status.hunger} 
          onChange={(v) => handleChange('hunger', v)} 
          color="rose"
        />
        <LevelSelector 
          label="공부량" 
          value={status.studyAmount} 
          onChange={(v) => handleChange('studyAmount', v)} 
          color="blue"
        />
      </div>
    </div>
  );
}

function LevelSelector({ label, value, onChange, color }: { label: string, value: Level, onChange: (v: Level) => void, color: string }) {
  const levels: Level[] = ['low', 'medium', 'high'];
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500'
  };

  return (
    <section>
      <label className="block text-slate-700 font-bold mb-3 font-gaegu text-xl">{label}</label>
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => onChange(l)}
            className={cn(
              "flex-1 py-3 text-lg rounded-xl transition-all font-gaegu font-bold",
              value === l 
                ? `${colorMap[color]} text-white shadow-md scale-[1.02]` 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {l === 'low' ? '낮음' : l === 'medium' ? '보통' : '높음'}
          </button>
        ))}
      </div>
    </section>
  );
}

function MoodIcon({ mood }: { mood: Mood }) {
  const size = 32;
  switch (mood) {
    case 'happy': return <Smile size={size} />;
    case 'neutral': return <Meh size={size} />;
    case 'sad': return <Frown size={size} />;
    case 'angry': return <Angry size={size} />;
    case 'exhausted': return <BatteryLow size={size} />;
  }
}

function translateMood(m: Mood) {
  const map: Record<Mood, string> = {
    happy: '좋음',
    neutral: '보통',
    sad: '슬픔',
    angry: '화남',
    exhausted: '지침'
  };
  return map[m];
}

function translateMeal(m: MealQuality) {
  const map: Record<MealQuality, string> = {
    poor: '부실',
    fair: '적당',
    good: '좋음',
    perfect: '완벽'
  };
  return map[m];
}

function translateSocial(s: SocialEnergy) {
  const map: Record<SocialEnergy, string> = {
    drained: '방전',
    low: '낮음',
    balanced: '보통',
    chilling: '여유',
    high: '높음'
  };
  return map[s];
}
