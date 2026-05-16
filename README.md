# Today's Me (오늘의 나)

당신의 하루를 캐릭터로 기록하고 공유하는 서비스입니다.

## Vercel 배포 방법

이 프로젝트는 Vercel에 최적화되어 있습니다. 다음 단계에 따라 배포하세요:

1. [Vercel](https://vercel.com)에 로그인합니다.
2. **Add New** -> **Project**를 클릭합니다.
3. GitHub 저장소(`kyj0920822-wq/Today-s-Me`)를 선택하여 Import 합니다.
4. **Framework Preset**이 `Vite`로 설정되어 있는지 확인합니다.
5. **Install Command**, **Build Command**, **Output Directory**는 기본값으로 두면 됩니다.
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Deploy** 버튼을 클릭합니다.

## 프로젝트 구조

- `src/App.tsx`: 메인 애플리케이션 로직
- `src/components/`: UI 컴포넌트
- `src/lib/utils.ts`: 캐릭터 생성 및 유틸리티 로직
- `vercel.json`: SPA 라우팅을 위한 설정 파일
