MOOHAE DIAGNOSIS FIX 적용 순서

1. moohae-site 저장소에서 아래 프론트 파일을 같은 경로로 교체합니다.
   diagnosis.html
   assets/css/diagnosis-preview.css
   assets/js/diagnosis.js
   assets/js/diagnosis-facility.js
   assets/js/diagnosis-preview-ui.js
   assets/images/diagnosis/*.webp

2. Supabase Edge Function도 반드시 업데이트합니다.
   supabase/functions/submit-diagnosis/index.ts

3. Supabase CLI를 사용하는 경우 supabase/config.toml의 아래 설정을 반영합니다.
   [functions.submit-diagnosis]
   verify_jwt = false

4. GitHub Pages/운영 주소에서 새로고침할 때 캐시된 JS/CSS가 남아 있으면 강력 새로고침합니다.
   diagnosis.html에는 20260929-2 버전 쿼리가 적용되어 있습니다.

보안:
- service_role / secret key는 GitHub, HTML, JS에 넣지 마세요.
- supabase-config.js의 publishable key는 기존 파일을 그대로 유지합니다.
