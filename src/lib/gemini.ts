import { GoogleGenAI, Type } from "@google/genai";
import { DailyStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateCharacterStory(status: DailyStatus) {
  const prompt = `
    오늘 나의 상태 정보를 줄게. 이걸 바탕으로 나를 표현하는 독특하고 귀여운 캐릭터와 짧은 한 줄 상태를 만들어줘.
    상태 정보:
    - 수민: ${status.sleepHours}시간, 기분: ${status.mood}, 식사: ${status.meal}, 사회적 에너지: ${status.socialEnergy}, 피로: ${status.fatigue}, 배고픔: ${status.hunger}, 공부: ${status.studyAmount}

    조건:
    - 캐릭터 이름은 아주 독특하고 귀엽게 (예: '멘탈 탈탈 팝콘', '밤샘 고수 부엉이', '각성한 에스프레소').
    - 한 줄 상태는 위트 있는 한국어로 작성.
    - 활력도는 0-100 사이 숫자로 모든 정보를 고려해 결정.

    기존 상태: ${status.characterType}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "너는 귀여운 다마고치 캐릭터를 만드는 작가야. 재미있고 공감가는 한국어 JSON 결과를 생성해.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            characterType: { type: Type.STRING, description: "캐릭터 이름 (예: 축 늘어진 고양이)" },
            description: { type: Type.STRING, description: "캐릭터 설명" },
            oneLiner: { type: Type.STRING, description: "짧은 한 줄 상태" },
            energyPercent: { type: Type.NUMBER, description: "0-100 사이 활력도" }
          },
          required: ["characterType", "description", "oneLiner", "energyPercent"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error", error);
    // Fallback logic
    return {
      characterType: "미스터리 생명체",
      description: "에너지가 파악되지 않는 의문의 상태예요.",
      oneLiner: "음... 나 뭐지?",
      energyPercent: 50
    };
  }
}
