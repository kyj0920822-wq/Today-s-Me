import { motion, AnimatePresence } from 'motion/react';
import { CharacterConfig } from '../types';
import { Sparkles, Heart, Zap, Moon, CloudRain, Flame, PartyPopper, Cloud, Shield, Laptop, Coffee, Music, Sun, Umbrella, Star, Ghost } from 'lucide-react';
import { cn } from '../lib/utils';

interface CharacterProps {
  config: CharacterConfig;
}

export default function Character({ config }: CharacterProps) {
  const { primaryColor, secondaryColor, eyeType, mouthType, eyebrowType, accessory } = config;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Main Body */}
      <motion.div
        layout
        className="relative z-10 w-48 h-48 flex flex-col items-center justify-center overflow-hidden"
        style={{ 
          backgroundColor: primaryColor,
          borderRadius: 
            config.state === 'happy' ? '50%' : // Perfect sphere
            config.state === 'sad' ? '40% 40% 50% 50% / 30% 30% 70% 70%' :   // Heavy bottom
            config.state === 'angry' ? '30% 30% 30% 30% / 30% 30% 30% 30%' : // Sharper/Squarish
            config.state === 'exhausted' ? '60% 60% 40% 40% / 50% 50% 50% 50%' : // Less squashed
            '45% 55% 70% 30% / 60% 40% 60% 40%' // Default blob
        }}
        animate={{
          y: [0, -10, 0],
          rotate: config.state === 'angry' ? [-2, 2, -2] : config.state === 'happy' ? [-1, 1, -1] : config.accessory === 'party' ? [-5, 5, -5] : [0, 0, 0],
          scaleY: config.state === 'exhausted' ? 0.8 : 1,
          scaleX: config.state === 'exhausted' ? 1.15 : 1,
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.3, repeat: Infinity },
        }}
      >
        {/* Subtle highlights */}
        <div 
          className="absolute top-2 left-4 w-12 h-6 bg-white/30 rounded-full blur-sm -rotate-45" 
        />

        {/* Eyebrows Area */}
        <div className="flex gap-14 mb-1">
          <Eyebrow type={eyebrowType || 'none'} color={secondaryColor} side="left" />
          <Eyebrow type={eyebrowType || 'none'} color={secondaryColor} side="right" />
        </div>

        {/* Eyes Area */}
        <div className="relative flex gap-8">
          <Eye type={eyeType} color={secondaryColor} />
          <Eye type={eyeType} color={secondaryColor} />
          
          {/* Cheek Blush - positioned under eyes */}
          {config.state === 'happy' && (
            <div className="absolute top-6 inset-x-0 flex justify-between -mx-6">
              <div className="w-5 h-2.5 bg-pink-400/40 rounded-full blur-[2px]" />
              <div className="w-5 h-2.5 bg-pink-400/40 rounded-full blur-[2px]" />
            </div>
          )}
        </div>

        {/* Mouth Area */}
        <div className="mt-7">
          <Mouth type={mouthType} color={secondaryColor} />
        </div>
      </motion.div>

      {/* Accessories */}
      <AnimatePresence mode="wait">
        <motion.div
          key={accessory}
          initial={{ opacity: 0, scale: 0, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -10 }}
          className="absolute top-0 right-0 z-20"
        >
          {accessory === 'sparkles' && <Sparkles className="text-yellow-500 w-12 h-12 animate-pulse" />}
          {accessory === 'heart' && <Heart className="text-pink-500 w-10 h-10 fill-pink-500" />}
          {accessory === 'zzz' && (
            <div className="flex flex-col -space-y-2">
              <span className="text-blue-500 font-bold text-xl animate-bounce delay-75">Z</span>
              <span className="text-blue-400 font-bold text-lg animate-bounce delay-150">z</span>
              <span className="text-blue-300 font-bold text-sm animate-bounce delay-300">z</span>
            </div>
          )}
          {accessory === 'fire' && <Flame className="text-orange-600 w-12 h-12 animate-bounce" />}
          {accessory === 'sweat' && <CloudRain className="text-blue-400 w-10 h-10" />}
          {accessory === 'book' && <div className="text-4xl">📚</div>}
          {accessory === 'bread' && <div className="text-4xl">🍞</div>}
          {accessory === 'party' && <PartyPopper className="text-pink-500 w-12 h-12 animate-bounce" />}
          {accessory === 'cloud' && <Cloud className="text-slate-300 w-12 h-12 animate-pulse" />}
          {accessory === 'shield' && <Shield className="text-orange-500 w-12 h-12 fill-orange-50" />}
          {accessory === 'coffee' && <Coffee className="text-amber-800 w-12 h-12" />}
          {accessory === 'laptop' && <Laptop className="text-slate-600 w-12 h-12" />}
          {accessory === 'music' && <Music className="text-indigo-500 w-12 h-12 animate-bounce" />}
          {accessory === 'moon' && <Moon className="text-yellow-200 fill-yellow-200 w-12 h-12" />}
          {accessory === 'sun' && <Sun className="text-orange-400 w-12 h-12 animate-spin-slow" />}
          {accessory === 'rain' && <Umbrella className="text-sky-500 w-12 h-12" />}
          {accessory === 'star' && <Star className="text-yellow-400 fill-yellow-400 w-12 h-12 animate-pulse" />}
          {accessory === 'ghost' && <Ghost className="text-slate-400 w-12 h-12 opacity-50" />}
        </motion.div>
      </AnimatePresence>

      {/* Ground Shadow */}
      <motion.div 
        className="absolute -bottom-4 w-32 h-4 bg-black/10 rounded-[100%] blur-md"
        animate={{ scaleX: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function Eyebrow({ type, color, side }: { type: string, color: string, side: 'left' | 'right' }) {
  if (type === 'none') {
    // Arched brows for happy state even if "none" is specified
    return (
      <div className="w-6 h-3 border-t-4 rounded-[100%] opacity-80" style={{ borderColor: color }} />
    );
  }
  
  return (
    <motion.div 
      className={cn(
        "w-6 h-1.5 rounded-full",
        type === 'angry' && (side === 'left' ? 'rotate-[20deg]' : '-rotate-[20deg]'),
        type === 'sad' && (side === 'left' ? '-rotate-[20deg]' : 'rotate-[20deg]'),
        type === 'surprised' && '-translate-y-2'
      )}
      style={{ 
        backgroundColor: type === 'worried' ? 'transparent' : color,
        borderRadius: '50% 50% 0 0' 
      }}
    >
      {type === 'worried' && (
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: color }} />
          <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        </div>
      )}
    </motion.div>
  );
}

function Eye({ type, color }: { type: string, color: string }) {
  if (type === 'star') {
    return <Zap className="w-8 h-8 fill-yellow-400 text-yellow-500" />;
  }
  if (type === 'line') {
    return <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: color }} />;
  }
  if (type === 'heart') {
    return <Heart className="w-7 h-7 fill-pink-500 text-pink-600" />;
  }
  if (type === 'half-moon') {
    return <div className="w-8 h-4 border-t-4 rounded-[100%]" style={{ borderColor: color }} />;
  }
  if (type === 'closed') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-6 h-1 rounded-full mb-1" style={{ backgroundColor: color }} />
        <div className="w-4 h-0.5 rounded-full opacity-30" style={{ backgroundColor: color }} />
      </div>
    );
  }
  if (type === 'wink') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-8 h-4 border-b-4 rounded-full" style={{ borderColor: color }} />
      </div>
    );
  }
  if (type === 'dizzy') {
    return (
      <div className="relative w-7 h-7 flex items-center justify-center">
        <div className="absolute inset-0 border-2 rounded-full border-dashed animate-spin-slow" style={{ borderColor: color }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
      </div>
    );
  }
  if (type === 'circle') {
    return (
      <div className="w-6 h-6 rounded-full border-4 flex items-center justify-center overflow-hidden" style={{ borderColor: color }}>
        <div className="w-2 h-2 bg-white rounded-full translate-x-1 -translate-y-1" />
      </div>
    );
  }
  // Default dot with pupil highlight
  return (
    <div className="w-5 h-5 rounded-full relative overflow-hidden" style={{ backgroundColor: color }}>
      <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
      <div className="absolute bottom-1 right-1.5 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
    </div>
  );
}

function Mouth({ type, color }: { type: string, color: string }) {
  if (type === 'smile') {
    return (
      <div className="w-14 h-8 border-b-4 rounded-[100%]" style={{ borderColor: color }} />
    );
  }
  if (type === 'sad') {
    return (
      <div className="w-12 h-6 border-t-4 rounded-full mt-4" style={{ borderColor: color }} />
    );
  }
  if (type === 'pout') {
    return (
      <div className="w-6 h-3 border-t-4 rounded-full mt-2" style={{ borderColor: color }} />
    );
  }
  if (type === 'drool') {
    return (
      <div className="relative">
        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: color }} />
        <div className="absolute top-1 right-1 w-2 h-4 bg-blue-300/60 rounded-full blur-[1px]" />
      </div>
    );
  }
  if (type === 'tongue') {
    return (
      <div className="relative">
        <div className="w-10 h-4 border-b-4 rounded-full" style={{ borderColor: color }} />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-5 bg-rose-400 rounded-b-full border-2 border-rose-500" />
      </div>
    );
  }
  if (type === 'kiss') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-4 h-4 border-4 rounded-full" style={{ borderColor: color }} />
        <Heart size={10} className="fill-rose-400 text-rose-500 animate-pulse" />
      </div>
    );
  }
  if (type === 'open') {
    return (
      <div className="w-8 h-8 rounded-full border-4 flex items-center justify-center" style={{ borderColor: color, backgroundColor: `${color}22` }}>
        <div className="w-4 h-2 bg-pink-400/40 rounded-full mt-2" />
      </div>
    );
  }
  if (type === 'flat') {
    return (
      <div className="w-10 h-1 rounded-full" style={{ backgroundColor: color }} />
    );
  }
  // Default meh
  return (
    <div className="w-8 h-1 rounded-full rotate-2" style={{ backgroundColor: color }} />
  );
}
