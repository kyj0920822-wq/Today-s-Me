import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DailyStatus, CharacterState, CharacterConfig } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function determineCharacterState(status: DailyStatus): CharacterState {
  const { mood, fatigue } = status;
  
  if (mood === 'angry') return 'angry';
  if (mood === 'exhausted' || fatigue === 'high') return 'exhausted';
  if (mood === 'sad') return 'sad';
  if (mood === 'happy') return 'happy';
  
  return 'neutral';
}

export function getStateKoreanName(status: DailyStatus): string {
  const state = determineCharacterState(status);
  const { studyAmount, hunger, sleepHours, socialEnergy, fatigue, mood, meal } = status;

  // Extremely Specific Combinations (Highest Variety)
  if (studyAmount === 'high' && fatigue === 'high' && sleepHours < 4) return '밤샘 공부 고스트';
  if (studyAmount === 'high' && fatigue === 'low') return '열정 만랩 모범생';
  if (studyAmount === 'medium' && meal === 'perfect') return '자기개발 꿈나무';
  if (mood === 'angry' && fatigue === 'high') return '불타오르는 용암';
  if (mood === 'angry' && socialEnergy === 'high') return '까칠한 트러블메이커';
  if (hunger === 'high' && fatigue === 'high') return '아사 직전의 좀비';
  if (hunger === 'high' && meal === 'poor') return '먹이를 찾는 하이에나';
  if (socialEnergy === 'high' && mood === 'happy') return '반짝이는 인싸 댕댕이';
  if (socialEnergy === 'drained' && mood === 'sad') return '방구석 집돌이 유령';
  if (socialEnergy === 'chilling' && mood === 'happy') return '여유만만 구름 거북이';
  if (sleepHours > 9 && mood === 'happy' && fatigue === 'low') return '꿀잠 잔 게으른 고양이';
  if (sleepHours < 5 && fatigue === 'high' && mood === 'exhausted') return '다크서클 배터리';
  if (meal === 'perfect' && hunger === 'low') return '배부른 든든한 판다';
  if (mood === 'happy' && fatigue === 'low' && socialEnergy === 'balanced') return '행복한 무지개 요정';
  
  if (studyAmount === 'high' && socialEnergy === 'low') return '고독한 학구파 부엉이';
  if (meal === 'poor' && fatigue === 'high') return '기력 없는 갈대';
  if (mood === 'happy' && sleepHours < 6) return '잠 부족한 행운아';
  if (socialEnergy === 'chilling' && fatigue === 'low') return '세상 한가로운 베짱이';
  if (mood === 'sad' && meal === 'perfect') return '먹는 걸로 푸는 먹순이';
  
  switch (state) {
    case 'happy': return '미소 짓는 쿼카';
    case 'neutral': return '평범한 나무늘보';
    case 'sad': return '비 내리는 솜사탕';
    case 'angry': return '매운 불떡볶이';
    case 'exhausted': return '탈탈 털린 종이인형';
    default: return '미지의 존재';
  }
}

export function getStateMessage(status: DailyStatus) {
  const state = determineCharacterState(status);
  const { studyAmount, hunger, sleepHours, fatigue, mood, socialEnergy } = status;

  if (studyAmount === 'high' && fatigue === 'high') return '열심히 달린 당신, 뇌가 조금 열을 받았을지도 몰라요. 잠시 눈을 붙여볼까요?';
  if (hunger === 'high') return '지금 당장 맛있는 걸 먹지 않으면 큰일 날 것 같아요! 꼬르륵 소리가 여기까지 들려요.';
  if (sleepHours < 5) return '눈꺼풀이 천근만근... 하품이 계속 나오네요. 시원한 커피보다는 따뜻한 이불이 필요해요.';
  if (socialEnergy === 'drained') return '혼자만의 시간이 절실해 보여요. 스마트폰은 잠시 내려두고 조용한 음악을 들어보는 건 어때요?';
  if (mood === 'happy' && fatigue === 'low') return '컨디션 최고! 오늘 같은 날엔 평소 미뤄뒀던 일을 해보는 것도 좋겠어요.';
  
  switch (state) {
    case 'happy': return '입가에 미소가 떠나지 않네요. 오늘 같은 날엔 뭐든 즐겁게 할 수 있을 거예요!';
    case 'neutral': return '잔잔하고 평온한 호수 같은 하루예요. 가끔은 이런 평범함이 가장 소중한 법이죠.';
    case 'sad': return '마음에 작은 구름이 꼈나 봐요. 슬픈 영화 한 편 보면서 펑펑 울고 나면 좀 나아질지도요?';
    case 'angry': return '누가 건드리기만 해도 팡! 터질 것 같아요. 시원한 물 한 잔 마시며 열을 식혀봐요.';
    case 'exhausted': return '손가락 하나 까딱할 힘도 없네요. 오늘은 그냥 푹 쉬는 게 최고의 스케줄이에요.';
    default: return '오늘의 나는 어떤 모습일까요? 기록을 통해 확인해보세요.';
  }
}

export function getDetailedCharacterConfig(status: DailyStatus): CharacterConfig {
  const state = determineCharacterState(status);
  const { studyAmount, hunger, sleepHours, socialEnergy, fatigue, mood, meal } = status;

  let config: CharacterConfig = {
    state,
    primaryColor: '#E2E8F0',
    secondaryColor: '#94A3B8',
    eyeType: 'dot',
    mouthType: 'meh',
    eyebrowType: 'none'
  };

  // 1. Initial State Colors & Parts
  switch (state) {
    case 'happy':
      config = { ...config, primaryColor: '#86EFAC', secondaryColor: '#166534', eyeType: 'dot', mouthType: 'smile', eyebrowType: 'none', accessory: 'sparkles' };
      break;
    case 'neutral':
      config = { ...config, primaryColor: '#BFDBFE', secondaryColor: '#1E40AF', eyeType: 'dot', mouthType: 'meh', eyebrowType: 'normal' };
      break;
    case 'sad':
      config = { ...config, primaryColor: '#A5B4FC', secondaryColor: '#3730A3', eyeType: 'closed', mouthType: 'sad', eyebrowType: 'sad', accessory: 'cloud' };
      break;
    case 'angry':
      config = { ...config, primaryColor: '#FDA4AF', secondaryColor: '#9F1239', eyeType: 'dot', mouthType: 'pout', eyebrowType: 'angry', accessory: 'fire' };
      if (hunger === 'high') {
        config.mouthType = 'open';
        config.eyebrowType = 'angry';
      }
      if (studyAmount === 'high') {
        config.eyeType = 'dizzy';
        config.eyebrowType = 'angry';
      }
      if (socialEnergy === 'high') {
        config.eyeType = 'star';
        config.mouthType = 'pout';
      }
      if (socialEnergy === 'drained') {
        config.eyeType = 'dot';
        config.mouthType = 'meh';
        config.accessory = 'ghost';
      }
      if (sleepHours < 5) {
        config.eyeType = 'line';
        config.accessory = 'sweat';
      }
      if (fatigue === 'high') {
        config.eyeType = 'line';
        config.eyebrowType = 'angry';
        config.mouthType = 'flat';
      }
      if (meal === 'perfect') {
        config.mouthType = 'smile';
      }
      break;
    case 'exhausted':
      config = { ...config, primaryColor: '#CBD5E1', secondaryColor: '#334155', eyeType: 'line', mouthType: 'drool', eyebrowType: 'none', accessory: 'zzz' };
      break;
  }

  // 2. High-Priority Status Overrides (Variety)

  // -- STUDY --
  if (studyAmount === 'high') {
    config.accessory = 'laptop';
    if (fatigue === 'high') {
      config.eyeType = 'dizzy';
      config.eyebrowType = 'sad';
    } else {
      config.eyeType = 'circle';
      config.eyebrowType = 'surprised';
    }
  }

  // -- HUNGER & MEAL --
  if (hunger === 'high') {
    config.accessory = 'bread';
    config.mouthType = 'open';
    if (mood === 'angry') {
      config.eyebrowType = 'angry';
      config.mouthType = 'pout';
    }
  } else if (meal === 'perfect' && state === 'happy') {
    config.mouthType = 'smile';
    config.accessory = 'sparkles';
  }

  // -- SLEEP --
  if (sleepHours < 5) {
    config.accessory = 'coffee';
    if (state !== 'angry') {
      config.eyebrowType = 'worried';
      config.eyeType = 'line';
    }
  } else if (sleepHours > 9 && state === 'happy') {
    config.eyeType = 'heart';
    config.mouthType = 'kiss';
    config.accessory = 'moon';
  }

  // -- SOCIAL --
  if (socialEnergy === 'high' && state === 'happy') {
    config.eyeType = 'star';
    config.mouthType = 'open';
    config.accessory = 'party';
  } else if (socialEnergy === 'low' || socialEnergy === 'drained') {
    if (state !== 'happy') {
      config.accessory = 'ghost';
      config.eyeType = 'line';
    } else {
      config.accessory = 'music';
      config.eyeType = 'wink';
    }
  }

  // -- FATIGUE --
  if (fatigue === 'high') {
    if (mood === 'neutral' || mood === 'exhausted') {
      config.eyeType = 'line';
      config.mouthType = 'flat';
      config.accessory = 'sweat';
    }
    if (mood === 'sad') {
      config.accessory = 'rain';
    }
  }

  // -- MISC MOOD COMBOS --
  if (mood === 'happy' && socialEnergy === 'high') {
    config.eyeType = 'wink';
    config.mouthType = 'smile';
    config.accessory = 'sun';
  }
  
  if (mood === 'happy' && fatigue === 'low' && socialEnergy === 'balanced') {
    config.accessory = 'star';
  }

  return config;
}
