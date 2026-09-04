# 공통수학2 탐구실

2022 개정 교육과정 공통수학2의 소단원별 생기부 탐구 소재를 찾아보는 반응형 웹사이트입니다.

## 로컬 실행

Node.js 22 환경에서 다음 명령을 실행합니다.

```bash
npm install
npm run dev
```

## Netlify 배포

저장소를 Netlify에 연결하면 `netlify.toml`의 설정에 따라 자동으로 빌드됩니다.

- Build command: `npm run build`
- Publish directory: `dist/client`
- Node version: `22.14.0`

수동 배포가 필요하면 `npm run build` 후 생성되는 `dist/client` 폴더를 Netlify Deploys 화면에 업로드합니다.
