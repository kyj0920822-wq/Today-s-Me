import { useRef, useState } from 'react';
import { toBlob, toPng } from 'html-to-image';
import { DailyStatus, CharacterConfig } from '../types';
import { getStateKoreanName, getStateMessage } from '../lib/utils';
import Character from './Character';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, Instagram, X, Sparkles, Heart } from 'lucide-react';

interface ShareCardProps {
  status: DailyStatus;
  config: CharacterConfig;
  onClose: () => void;
}

export default function ShareCard({ status, config, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = async (type: 'download' | 'share') => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      // Small delay to ensure rendering matches capture
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        cacheBust: true,
        pixelRatio: 3, // Even higher res for better quality
      });

      if (type === 'download') {
        const link = document.createElement('a');
        link.download = `today-character-${status.date}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        // Try sharing first
        try {
          const blob = await fetch(dataUrl).then(res => res.blob());
          const file = new File([blob], 'today-character.png', { type: 'image/png' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: '오늘의 나',
              text: `[오늘의 나] 나의 캐릭터는 '${getStateKoreanName(status)}'!`,
            });
          } else {
            throw new Error('Native sharing not supported');
          }
        } catch (shareErr) {
          console.warn('Native share failed or not available, falling back to download', shareErr);
          // Fallback: Just download the image and alert
          const link = document.createElement('a');
          link.download = `today-character-${status.date}.png`;
          link.href = dataUrl;
          link.click();
          alert('현재 브라우저에서 직접 공유기능을 지원하지 않아 이미지가 저장되었습니다. 저장된 이미지를 인스타그램이나 메신저에 공유해주세요!');
        }
      }
    } catch (err) {
      console.error('Failed to export image', err);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6"
    >
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[110]">
        <button 
          onClick={onClose}
          className="p-3 md:p-4 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-xl border border-white/20 shadow-lg active:scale-95"
          aria-label="Close share card"
        >
          <X size={20} className="md:w-7 md:h-7" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-h-[80vh]">
        {/* The Card - Hidden by default but captured */}
        <div 
          ref={cardRef}
          className="relative w-[320px] aspect-[9/16] rounded-[48px] overflow-hidden shadow-2xl flex flex-col items-center p-10 text-center"
          style={{ backgroundColor: 'white' }}
        >
          {/* Immersive background - subtle gradient/glows */}
          <div className="absolute inset-0 pointer-events-none" style={{ 
            background: `radial-gradient(circle at top right, ${config.primaryColor}15, transparent), 
                        radial-gradient(circle at bottom left, ${config.secondaryColor}10, transparent),
                        white` 
          }} />
          
          <div className="absolute top-1/4 -right-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${config.primaryColor}33` }} />
          <div className="absolute bottom-1/4 -left-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${config.secondaryColor}22` }} />

          {/* Card Top Branding */}
          <div className="relative z-10 w-full flex justify-between items-center mb-12">
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">{status.date}</span>
              <span className="text-[8px] font-mono text-slate-300 block">
                {status.timestamp ? new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-gaegu text-lg font-bold text-slate-800 tracking-tight">오늘의 나</span>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] text-white font-bold" style={{ backgroundColor: config.secondaryColor }}>나</div>
            </div>
          </div>

          <div className="relative z-10 mb-8 mt-4">
             <div className="absolute -inset-14 blur-3xl rounded-full" style={{ backgroundColor: `${config.primaryColor}22` }} />
             <div className="scale-100">
                <Character config={config} />
             </div>
          </div>

          <div className="relative z-10 mt-10 space-y-5 w-full">
            <div className="flex items-center justify-center gap-2 px-3 py-1 font-bold rounded-full border inline-flex mx-auto" style={{ backgroundColor: `${config.primaryColor}11`, color: config.secondaryColor, borderColor: `${config.secondaryColor}22` }}>
              <Sparkles size={11} className="animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-mono">Today's Character</span>
            </div>
            
            <h3 className="text-4xl font-gaegu font-bold tracking-tight w-full truncate" style={{ color: config.secondaryColor }}>
              {getStateKoreanName(status)}
            </h3>

            <p className="text-[12px] text-slate-600 font-gaegu leading-relaxed max-w-[200px] mx-auto">
              {getStateMessage(status)}
            </p>
          </div>

          <div className="relative z-10 mt-auto mb-28 flex flex-col items-center gap-1.5 px-6">
             <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase italic font-bold">
               Generated by Today's Character AI
             </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
        <button 
          onClick={() => exportImage('download')}
          disabled={isExporting}
          className="flex flex-col items-center bg-white/10 hover:bg-white/20 text-white p-4 rounded-3xl gap-2 transition-all backdrop-blur-md border border-white/10 disabled:opacity-50"
        >
          <Download size={24} />
          <span className="text-xs font-bold uppercase tracking-widest">저장하기</span>
        </button>
        <button 
          onClick={() => exportImage('share')}
          disabled={isExporting}
          className="flex flex-col items-center bg-indigo-500 text-white p-4 rounded-3xl gap-2 shadow-xl shadow-indigo-900/20 active:scale-95 disabled:opacity-50"
        >
          <Share2 size={24} />
          <span className="text-xs font-bold uppercase tracking-widest">공유하기</span>
        </button>
      </div>

      <div className="mt-6 text-white/40 flex items-center gap-2">
         <Instagram size={14} />
         <span className="text-[10px] font-bold uppercase tracking-widest">Story Share Compatible</span>
      </div>
    </motion.div>
  );
}
