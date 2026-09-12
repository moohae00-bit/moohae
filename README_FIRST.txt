MOOHAE NEXT CARE MESSAGE BOOKING V2
2026-09-13

============================================================
이번 V2의 고객 흐름
============================================================

신규 고객
HOME CHECK -> 고객정보 -> 일정 선택 -> 첫 예약

기존 고객
MOOHAE가 NEXT CARE 시점에 메시지 발송
-> [가능한 일정 확인하기]
-> 날짜/시간 선택
-> 예약 요청

기존 고객에게 다시 묻지 않는 것
- 이름
- 전화번호
- HOME CHECK
- 저장된 기본 HOME 주소

주소가 달라진 고객만 예약 화면의
[방문 주소가 달라졌나요?]를 눌러 이번 방문 주소를 입력합니다.

Care Report는 CARE 결과/기록 확인 역할만 유지합니다.
재예약 진입점으로 사용하지 않습니다.

============================================================
확정 NEXT CARE 메시지
============================================================

안녕하세요, 무해입니다.
지난번 CARE 이후 집은 잘 지내고 있나요?

기록해둔 다음 CARE 시점이 다가왔어요.
지금 다시 한번 관리가 필요하다고 느껴지시면 편한 일정을 확인해보세요.

아직 상태가 괜찮다면 서두르지 않으셔도 됩니다.
무해는 필요한 시점에 다시 찾아뵐게요.

[가능한 일정 확인하기]
<고객별 보안 예약 링크>

============================================================
적용 순서
============================================================

1) Supabase SQL Editor
   database/01_NEXT_CARE_MESSAGE_BOOKING_V2.sql 실행

2) 바로 이어서
   database/02_VERIFY_NEXT_CARE_MESSAGE_BOOKING_V2.sql 실행
   PASS가 전부 확인된 뒤 웹 파일 배포

3) moohae-site 교체/추가 경로

   admin/customer-detail.html
   assets/css/admin-customer-detail.css
   assets/js/admin-customer-detail.js

   booking.html
   assets/css/booking.css
   assets/js/booking.js

   report.html
   assets/css/report.css
   assets/js/report.js

   diagnosis.html
   assets/css/diagnosis.css
   assets/js/diagnosis.js

4) GitHub Desktop
   변경 목록 확인 -> Commit -> Push

============================================================
왜 report / diagnosis 파일도 포함되어 있나
============================================================

V1 웹 파일이 이미 적용되어 있든 아직 적용되지 않았든
최종 상태를 하나로 맞추기 위해 포함했습니다.

- report: V1의 재예약 CTA를 완전히 제거하고 원래 CARE REPORT 역할로 복귀
- diagnosis: V1의 기존 고객/Report 재예약 안내를 제거하고 원래 신규 CHECK 흐름 유지

submit-diagnosis Edge Function은 이번 V2에서 변경하지 않습니다.

============================================================
보안/데이터 원칙
============================================================

- Report public_token으로 재예약 토큰을 발급하지 않습니다.
- 재예약 링크는 인증된 MOOHAE staff가 관리자 화면에서만 발급합니다.
- DB에는 raw 예약 token을 저장하지 않고 SHA-256 hash만 저장합니다.
- 메시지 링크는 30일 유효, 예약 성공 시 즉시 폐기됩니다.
- 같은 고객에게 새 재예약 안내를 만들면 이전 미사용 링크는 폐기됩니다.
- booking URL의 token은 페이지가 읽은 직후 주소창/history에서 제거합니다.
- 공개 booking context는 HOME 전체 주소를 반환하지 않습니다.
- 기존 HOME 주소는 서버가 자동 사용합니다.
- 주소 변경을 선택한 경우에만 이번 방문 주소를 별도로 전달합니다.
- 기존 HOME 주소가 있는 경우 일회성 방문 주소로 자동 덮어쓰지 않습니다.
- 활성 예약은 CUSTOMER당 1개 원칙을 유지합니다.

============================================================
실제 브라우저 확인 항목
============================================================

A. 신규 고객 회귀 테스트
HOME CHECK -> 첫 예약이 기존과 동일하게 동작하는지 확인

B. 관리자
1. 고객 상세 -> MOOHAE HOME
2. 다음 CARE 예정일 입력/저장
3. [재예약 안내 준비]
4. 최종 메시지 + 보안 링크 생성
5. [메시지 전체 복사]

C. 기존 고객
1. 복사된 링크 열기
2. 이름/전화번호/HOME CHECK 없이 일정 화면 진입
3. 기존 HOME 주소가 있으면 주소 입력 없이 날짜/시간 선택
4. 주소가 다른 경우에만 [방문 주소가 달라졌나요?] 사용
5. 예약 요청

D. 예약 성공 후
- booking.customer_id = 기존 CUSTOMER
- booking.house_id = 기존 PRIMARY HOUSE
- booking.diagnosis_id = NULL
- 동일 링크 재사용 불가
- 두 번째 활성 예약 생성 차단

============================================================
정적 QA 참고
============================================================

- admin-customer-detail.js / booking.js / diagnosis.js / report.js: node --check
- HTML duplicate id 검사
- JS getElementById <-> HTML DOM 검사
- CSS brace balance 검사
- report 재예약 CTA / report-token 예약 경로 제거 검사

기존 diagnosis.js의 resultCopy DOM 참조 1건은 업로드된 원본에도 이미 존재하던 항목이며
이번 V2와 무관하여 임의 수정하지 않았습니다.

실제 Supabase 실행 및 브라우저 런타임 테스트는 사용 환경에서 최종 확인해야 합니다.
