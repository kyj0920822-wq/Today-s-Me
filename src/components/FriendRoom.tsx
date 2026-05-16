import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, setDoc, getDocs, where, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { DailyStatus, Reaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Coffee, Users, Soup, Sparkles, Copy, UserPlus, Check, Search, AlertCircle } from 'lucide-react';
import { cn, getDetailedCharacterConfig, getStateKoreanName } from '../lib/utils';
import Character from './Character';

export default function FriendRoom() {
  const [statuses, setStatuses] = useState<(DailyStatus & { id: string })[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendCode, setFriendCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [error, setError] = useState('');

  // Get My Profile for Code
  useEffect(() => {
    if (!auth.currentUser) return;
    getDoc(doc(db, 'users', auth.currentUser.uid)).then(snap => {
      if (snap.exists()) setFriendCode(snap.data().friendCode);
    });
  }, []);

  // Get My Friends List
  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(collection(db, 'users', auth.currentUser.uid, 'friends'), (snap) => {
      const friendIds = snap.docs.map(d => d.id);
      setFriends(friendIds);
      if (friendIds.length === 0) {
        setStatuses([]);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Get Friends' Statuses
  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    
    // Statuses query
    // If no friends, just finish loading
    if (friends.length === 0) {
      setLoading(false);
      return;
    }

    // Note: Firestore 'in' query supports up to 30 items
    // Also including own status in the room
    const targetUids = [...friends, auth.currentUser.uid];

    const q = query(
      collection(db, 'statuses'),
      where('userId', 'in', targetUids),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (DailyStatus & { id: string })[];
      setStatuses(docs);
      setLoading(false);
    }, (error) => {
      // If we get an error about needing an index, it will show in logs
      handleFirestoreError(error, OperationType.LIST, 'statuses');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [friends]);

  const addFriend = async () => {
    if (!searchCode || !auth.currentUser) return;
    setIsAdding(true);
    setError('');
    
    try {
      const q = query(collection(db, 'users'), where('friendCode', '==', searchCode.toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setError('해당 코드를 가진 친구를 찾을 수 없어요.');
      } else {
        const friendData = snap.docs[0].data();
        if (friendData.uid === auth.currentUser.uid) {
          setError('자기 자신은 친구로 추가할 수 없어요!');
        } else {
          await setDoc(doc(db, 'users', auth.currentUser.uid, 'friends', friendData.uid), {
            uid: friendData.uid,
            addedAt: serverTimestamp()
          });
          setSearchCode('');
          alert(`${friendData.displayName}님이 친구로 추가되었습니다!`);
        }
      }
    } catch (e) {
      console.error(e);
      setError('친구 추가 중에 오류가 발생했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  const copyMyCode = () => {
    if (!friendCode) return;
    navigator.clipboard.writeText(friendCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const addReaction = async (statusId: string, type: 'like' | 'coffee' | 'hug' | 'food') => {
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'statuses', statusId, 'reactions'), {
        type,
        fromUserId: auth.currentUser.uid,
        fromName: auth.currentUser.displayName || '익명의 친구',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `statuses/${statusId}/reactions`);
    }
  };

  if (!auth.currentUser) return (
    <div className="p-12 text-center space-y-4">
      <Users size={48} className="mx-auto text-slate-200" />
      <p className="font-gaegu text-xl text-slate-500">친구 소식을 보려면 로그인이 필요해요!</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Friend Management Card */}
      <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* My Code Section */}
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Sparkles size={12} /> My Friend Code
            </h4>
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-mono font-bold text-indigo-600 tracking-wider">
                {friendCode || '......'}
              </div>
              <button 
                onClick={copyMyCode}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  copyFeedback ? "bg-emerald-500 text-white" : "bg-white border border-slate-100 text-slate-400 hover:text-indigo-500"
                )}
              >
                {copyFeedback ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Add Friend Section */}
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <UserPlus size={12} /> Add Friend
            </h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="코드 6자리 입력"
                value={searchCode}
                onChange={e => setSearchCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 font-mono uppercase"
              />
              <button 
                onClick={addFriend}
                disabled={isAdding || !searchCode}
                className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isAdding ? <Search size={18} className="animate-spin" /> : <UserPlus size={18} />}
                <span className="font-gaegu">추가</span>
              </button>
            </div>
            {error && <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1"><AlertCircle size={10} /> {error}</p>}
            <p className="text-[9px] text-slate-400 mt-2">친구의 코드를 입력해서 팔로우하세요!</p>
          </div>
        </div>
      </section>

      {/* Friends Status Feed */}
      <div className="space-y-6">
        <h2 className="font-gaegu text-3xl font-bold flex items-center gap-2 text-slate-800">
          <Users className="text-indigo-500" />
          우리들의 소식
        </h2>
        
        {loading ? (
          <div className="p-12 text-center animate-pulse text-slate-300 font-gaegu text-xl">친구들의 캐릭터를 불러오는 중...</div>
        ) : statuses.length === 0 ? (
          <div className="p-16 text-center bg-white/50 rounded-[40px] border border-dashed border-slate-200">
            <p className="font-gaegu text-xl text-slate-400">아직 친구가 없어요.<br/>코드를 공유해 친구를 추가해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {statuses.map((s) => (
              <motion.div 
                layout
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
              >
                {/* Energy Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${s.energyPercent}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      s.energyPercent > 70 ? "bg-emerald-400" : s.energyPercent > 30 ? "bg-indigo-400" : "bg-rose-400"
                    )}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center lg:items-start">
                  <div className="flex-shrink-0 scale-75 md:scale-95 origin-center">
                    <Character config={getDetailedCharacterConfig(s)} />
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <h3 className="font-gaegu text-3xl font-bold text-slate-800 leading-none">{getStateKoreanName(s)}</h3>
                        <p className={cn(
                          "font-mono text-[10px] uppercase tracking-wider mt-2 px-2 py-0.5 rounded-full inline-block w-fit",
                          s.energyPercent > 70 ? "bg-emerald-50 text-emerald-600" : s.energyPercent > 30 ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"
                        )}>
                          🔋 Energy {s.energyPercent}%
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="font-gaegu text-slate-400 text-sm">{s.date}</div>
                        {s.userId === auth.currentUser?.uid && (
                          <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-sm font-mono mt-1">MY STATUS</span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 font-gaegu text-2xl leading-tight italic bg-indigo-50/30 p-4 rounded-2xl border-l-4 border-indigo-300">
                      "{s.oneLiner || s.description}"
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <ReactionButton icon={<Heart size={18} />} label="안아주기" onClick={() => addReaction(s.id, 'hug')} color="rose" />
                      <ReactionButton icon={<Coffee size={18} />} label="커피주기" onClick={() => addReaction(s.id, 'coffee')} color="amber" />
                      <ReactionButton icon={<Soup size={18} />} label="야식주기" onClick={() => addReaction(s.id, 'food')} color="orange" />
                      <ReactionButton icon={<Sparkles size={18} />} label="따봉" onClick={() => addReaction(s.id, 'like')} color="indigo" />
                    </div>
                    
                    <ReactionList statusId={s.id} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReactionButton({ icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all border shadow-sm active:scale-95",
        color === 'rose' && "bg-white text-rose-600 border-rose-100 hover:bg-rose-50",
        color === 'amber' && "bg-white text-amber-600 border-amber-100 hover:bg-amber-50",
        color === 'orange' && "bg-white text-orange-600 border-orange-100 hover:bg-orange-50",
        color === 'indigo' && "bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50"
      )}
    >
      {icon}
      <span className="font-gaegu text-base">{label}</span>
    </button>
  );
}

function ReactionList({ statusId }: { statusId: string }) {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'statuses', statusId, 'reactions'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    return onSnapshot(q, (snapshot) => {
      setReactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Reaction[]);
    });
  }, [statusId]);

  if (reactions.length === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-2xl">
      <div className="flex -space-x-3">
        {reactions.map((r) => (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={r.id} 
            className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-md text-xl" 
            title={r.fromName}
          >
            {r.type === 'hug' && '🫂'}
            {r.type === 'coffee' && '☕'}
            {r.type === 'food' && '🍜'}
            {r.type === 'like' && '👍'}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 font-gaegu leading-none">친구들의 응원</span>
        <span className="text-xs text-slate-600 font-gaegu font-bold">{reactions[0].fromName}님 등 {reactions.length}개의 반응</span>
      </div>
    </div>
  );
}
