MOOHAE diagnosis 미리보기 통합본 적용 안내
2026-09-29

가장 안전한 적용 방법
1. 현재 GitHub Desktop의 로컬 저장소 moohae-site 를 연다.
2. 작업 전 현재 변경사항이 있다면 먼저 Commit 한다.
3. 아래 파일을 동일 경로에 교체/추가한다.

교체
- diagnosis.html
- assets/js/diagnosis.js

추가
- assets/css/diagnosis-preview.css
- assets/js/diagnosis-preview-ui.js

수정하지 않음
- 관리자 페이지
- DB 구조
- Supabase RPC 이름
- 기존 시설 CHECK 저장 로직
- 예약 토큰 보안 구조

검증한 흐름
HOME 6Q → 결과 → 이름/연락처/방문주소 → 개인정보 동의 → 가능한 일정 조회 → 날짜/시간 선택 → 방문 요청
FACILITY 7Q → 시설 상담 접수

예약 표시 규칙
- 10:00 시작 → 오전 10:00 ~ 12:30
- 13:00 시작 → 오후 13:00 ~ 15:30
- 16:00 시작 → 오후 16:00 ~ 18:30
- 고객 화면 최대 예약 가능 날짜 5개

중요한 현재 blocker
assets/js/supabase-config.js 에 현재 등록된 Project URL은
https://tvullgydrkvqbutuhvsu.supabase.co
이다.

이전 실제 연결 확인에서 이 호스트가 정상 해석되지 않아, 실제 고객 데이터 저장 및 실제 예약 DB 반영은 아직 최종 검증할 수 없다.
정상 Supabase Project URL / Publishable key 확인 후 assets/js/supabase-config.js 의 브라우저용 값만 교체해야 한다.

[보안 절대 주의]
- service_role key / secret key를 브라우저 JS에 넣지 않는다.
- Supabase Publishable key만 브라우저에 둔다.
- raw booking token을 URL, localStorage, sessionStorage, HTML에 저장하지 않는다.
- submit-diagnosis Edge Function의 허용 Origin은 실제 운영 도메인 moohae.me / www.moohae.me 기준을 유지한다.

QA
- HTML ID 중복 없음
- HOME 질문 6개 확인
- FACILITY 질문 7개 확인
- JavaScript syntax check 통과
- 테스트 백엔드로 전체 HOME 예약 흐름 동작 통과
- 예약 완료 후 자동 홈 이동 제거: 고객이 완료 화면을 확인할 수 있음
