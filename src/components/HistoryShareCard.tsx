import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Share2, Sparkles, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { DailyStatus } from '../types';
import { getDetailedCharacterConfig, getStateKoreanName } from '../lib/utils';
import Character from './Character';

interface HistoryShareCardProps {
  history: DailyStatus[];
  onClose: () => void;
}

export default function HistoryShareCard({ history, onClose }: HistoryShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'download' | 'share') => {
    if (!cardRef.current || isExporting) return;

    try {
      setIsExporting(true);
      // Wait for a brief moment to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        cacheBust: true,
        pixelRatio: 2,
      });

      if (type === 'download') {
        const link = document.createElement('a');
        link.download = `my-emotion-history.png`;
        link.href = dataUrl;
        link.click();
      } else {
        try {
          const blob = await fetch(dataUrl).then(res => res.blob());
          const file = new File([blob], 'emotion-history.png', { type: 'image/png' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: '나의 감정 기록 보관소',
              text: '지난 시간들의 기록을 모아봤어요!',
            });
          } else {
            throw new Error('Not supported');
          }
        } catch (shareErr) {
          const link = document.createElement('a');
          link.download = `my-emotion-history.png`;
          link.href = dataUrl;
          link.click();
          alert('현재 환경에서 직접 공유를 지원하지 않아 이미지가 저장되었습니다.');
        }
      }
    } catch (err) {
      alert('이미지 생성에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm max-h-[85vh] flex flex-col items-center"
      >
        <div className="absolute -top-14 right-0 flex gap-2">
           <button onClick={onClose} className="p-2 bg-white rounded-full shadow-lg text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Container for Preview */}
        <div className="w-full overflow-y-auto mb-6 rounded-3xl shadow-2xl bg-white border border-white/20">
          <div ref={cardRef} className="bg-white p-8 w-full min-h-[600px] flex flex-col items-center">
            {/* Header in Image */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold mb-2">나</div>
              <h2 className="font-gaegu text-3xl font-bold text-slate-800 italic">나의 감정 보관소</h2>
              <div className="h-1 w-12 bg-indigo-200 mt-2 rounded-full" />
            </div>

            {/* Content List in Image */}
            <div className="w-full space-y-6">
              {history.map((record, index) => {
                const config = getDetailedCharacterConfig(record);
                return (
                  <div key={record.id || index} className="flex items-center gap-4 bg-orange-50/30 p-4 rounded-2xl border border-orange-100 shadow-sm">
                    <div 
                      className="w-14 h-14 flex items-center justify-center shrink-0" 
                    >
                      <div className="scale-[0.25]">
                        <Character config={config} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {record.date} {record.timestamp ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                      </span>
                      <h3 className="font-gaegu text-xl font-bold truncate" style={{ color: config.secondaryColor }}>
                        {getStateKoreanName(record)}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer in Image */}
            <div className="mt-12 pt-6 border-t border-indigo-100 w-full flex flex-col items-center gap-1 opacity-60">
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400">Created with TODAY'S ME</span>
              <span className="text-[8px] text-slate-400">당신의 감정을 캐릭터로 담아보세요</span>
            </div>
          </div>
        </div>

        {/* Actions Outside the Image Capture Area */}
        <div className="w-full grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-md p-4 rounded-[2rem] border border-white/20">
          <button 
            disabled={isExporting}
            onClick={() => handleExport('download')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-indigo-500 rounded-2xl font-bold font-gaegu text-xl shadow-lg hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin" /> : <Download size={20} />}
            이미지 저장
          </button>
          <button 
            disabled={isExporting}
            onClick={() => handleExport('share')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-500 text-white rounded-2xl font-bold font-gaegu text-xl shadow-lg hover:bg-indigo-600 transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin" /> : <Share2 size={20} />}
            공유하기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
