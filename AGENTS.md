# Agents

Remotion 비디오 모노레포.

## 구조

- 의존성: 루트 `package.json`에서 관리
- 프로젝트: `videos/yyyy/mm/{name}/` 단위
- 각 프로젝트는 `index.ts`(엔트리), `Root.tsx`(Composition 등록), 컴포넌트 파일들로 구성

## 새 프로젝트

```bash
./new-video.sh <name>
```

## 명령어

```bash
npx remotion studio videos/yyyy/mm/{name}/index.ts   # 스튜디오
npx remotion render videos/yyyy/mm/{name}/index.ts Main  # 렌더링
```
