MOOHAE CARE REPORT DETAIL V2.3
2026-09-13

목적
- TODAY'S CARE를 기존의 포괄적인 "바닥 케어 / 패브릭 케어" 표시가 아니라,
  현장 03 CARE에서 실제 CARE COMPLETE 된 object와 체크 완료된 세부 항목으로 표시합니다.
- CARE SUMMARY를 실제 care_records 기준으로 표시합니다.
  MAIN AREA  = 03 CARE의 CARE COMPLETE 대상 전체
  NEXT CARE  = 02 CHECK의 NEXT CARE 대상 전체
  NEXT CHECK = 02 CHECK의 NEXT CHECK 대상 전체
- BEFORE / AFTER 이미지 확대 기능은 V2.2 그대로 유지합니다.
- VISIT DIAGNOSIS 공개 섹션은 다시 추가하지 않습니다.

중요
- 기존 get_public_care_report()는 변경하지 않습니다.
- care_records / house_objects에 anon 직접 SELECT 권한을 추가하지 않습니다.
- 새 공개 RPC는 "발행된 Care Report public_token"에 연결된 한 방문의 표시용 정보만 반환합니다.
- 내부 UUID, 전화번호, partner_note, condition_status는 새 RPC 결과에 포함하지 않습니다.

적용 순서
1. Supabase SQL Editor에서 database/01_REPORT_DETAIL_V2_3.sql 실행
2. database/02_VERIFY_REPORT_DETAIL_V2_3.sql 실행
3. 01~06 모두 PASS 확인
4. 아래 3개 파일 교체
   - report.html
   - assets/css/report.css
   - assets/js/report.js
5. GitHub Desktop Commit / Push
6. 이미 발행된 Care Report 1건으로 실제 브라우저 확인

화면 확인 예시
- 매트리스
  CARE COMPLETE
  ✓ 상면 전체
  ✓ 측면
  ✓ 가장자리·봉제선

- 바닥
  CARE COMPLETE
  ✓ 주요 생활 영역
  ✓ 가구 주변 접근 가능 범위
  ✓ 모서리·가장자리

주의
- 위 예시는 기본 definition_of_done 구조를 설명한 것입니다.
- 실제 공개 Report는 하드코딩된 예시가 아니라 현장에서 실제 체크되어 저장된 dod_completed 값을 표시합니다.
