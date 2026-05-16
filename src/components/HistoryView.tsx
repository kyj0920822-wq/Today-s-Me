import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { DailyStatus } from '../types';
import { motion } from 'motion/react';
import { Calendar, Trash2, ChevronRight, Clock } from 'lucide-react';
import { getDetailedCharacterConfig, getStateKoreanName, cn } from '../lib/utils';
import Character from './Character';

export default function HistoryView() {
  const [history, setHistory] = useState<DailyStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'statuses'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('date', 'desc'),
          limit(30)
        );
        const querySnapshot = await getDocs(q);
        const docs: DailyStatus[] = [];
        querySnapshot.forEach((doc) => {
          docs.push(doc.data() as DailyStatus);
        });
        setHistory(docs);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'statuses');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="font-gaegu text-xl text-slate-400">기록 불러오는 중...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-6">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
          <Calendar size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="font-gaegu text-2xl font-bold text-slate-700">기록이 아직 없어요!</h3>
          <p className="text-slate-400 font-gaegu text-lg leading-snug">첫 오늘의 나를 기록하러 가볼까요?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-gaegu text-2xl font-bold flex items-center gap-2 text-slate-700">
          <Clock size={20} className="text-indigo-400" />
          과거의 나 기록지
        </h3>
        <span className="text-xs text-slate-400 font-mono italic">최근 30일</span>
      </div>

      <div className="grid gap-6">
        {history.map((record, index) => (
          <HistoryItem key={record.date} record={record} index={index} />
        ))}
      </div>
    </div>
  );
}

interface HistoryItemProps {
  record: DailyStatus;
  index: number;
  key?: string | number | null;
}

function HistoryItem({ record, index }: HistoryItemProps) {
  const config = getDetailedCharacterConfig(record);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden scale-75 origin-center">
        <Character config={config} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{record.date}</span>
        </div>
        <h4 className="font-gaegu text-2xl font-bold text-slate-800 truncate mb-1">
          {getStateKoreanName(record)}
        </h4>
        <p className="text-slate-500 font-gaegu text-base truncate italic">
          "{record.oneLiner || '어떤 하루였을까?'}"
        </p>
      </div>

      <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
        <ChevronRight size={24} />
      </div>
    </motion.div>
  );
}
