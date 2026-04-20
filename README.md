# videos

Remotion 기반 비디오 모노레포. 의존성은 루트에서 관리하고, 각 프로젝트는 `videos/yyyy/mm/{name}/` 아래에 위치.

## Setup

```bash
npm install
```

## Usage

```bash
# 새 프로젝트 생성
./new-video.sh my-video

# 스튜디오
npx remotion studio videos/2026/04/my-video/index.ts

# 렌더링
npx remotion render videos/2026/04/my-video/index.ts Main
```
