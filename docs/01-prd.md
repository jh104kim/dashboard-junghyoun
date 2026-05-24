
# 1. Product Overview

## 1.1 Product Name

Personal Life OS Dashboard

---

## 1.2 Product Vision

이 프로젝트는 단순 Dashboard가 아니다.

본 시스템은:

> 건강, 자산, 투자, 소비, 연금, 세금, 라이프로그를 하나의 운영체계(OS)처럼 관리하는 Samsung Galaxy 기반 Personal Executive Operating System

이다.

목표는:
- 데이터 기반 자기 인식(Self Awareness)
- 장기 추세 기반 의사결정
- 건강 + 자산 균형 관리
- 배우자와의 공유
- AI 기반 인사이트
- 지속적인 데이터 축적

을 하나의 플랫폼으로 통합하는 것이다.

---

# 2. Product Goals

## 핵심 목표

사용자는 Dashboard를 열고 5초 안에 아래를 인지해야 한다.

- 현재 건강 상태
- 순자산 상태
- 소비 위험 여부
- 투자 상태
- 은퇴 준비 상태
- 이상 징후
- 최근 변화
- 장기 추세

---

## UX 핵심 철학

| 원칙 | 설명 |
|---|---|
| No Scroll | 랜딩 페이지는 스크롤 없음 |
| 5-Second Awareness | 5초 내 상태 인지 |
| Dense Information | 높은 정보 밀도 |
| Drill-down First | 클릭 시 상세 분석 |
| Long-term Trend | 장기 시계열 중심 |
| Family Shared | 배우자 공유 |
| Continuous Update | 지속 데이터 누적 |
| AI Ready | 향후 AI Agent 확장 가능 |

---

# 3. Primary Platform

## Main Ecosystem

Samsung Galaxy Ecosystem

---

## Supported Devices

### Primary
- Galaxy Smartphone
- Galaxy Tablet (Landscape)

### Secondary
- Desktop Web (1920x1080)

---

## Important Note

본 사용자는 iPhone을 사용하지 않음.

따라서:
- Apple Health 미지원
- iOS 최적화 불필요
- Samsung Health 중심 설계

---

# 4. Core Domains

```text
Health
Finance
Investment
Spending
Retirement
Tax
AI Insight
Data Center
````

---

# 5. Information Architecture

```text
[Overview]
 ├── Health
 ├── Finance
 ├── Investment
 ├── Spending
 ├── Retirement
 ├── Tax
 ├── Analytics
 ├── AI Insight
 └── Data Center
```

---

# 6. Dashboard Philosophy

## 최종 스타일

### Bloomberg + Samsung Health + Modern SaaS BI

---

## 스타일 역할 정의

| 스타일            | 역할                  |
| -------------- | ------------------- |
| Bloomberg      | 금융/투자 정보 밀도         |
| Samsung Health | 건강 시각화 UX           |
| Linear/Vercel  | Modern SaaS UI      |
| Grafana        | Dense Monitoring 구조 |

---

# 7. Benchmark Site Usage Strategy

## 중요한 개념

Benchmark 사이트는 디자인 복사가 아니다.

목적은:

* 정보 구조 참고
* KPI 배치 참고
* Interaction 참고
* 정보 hierarchy 참고
* 시각화 패턴 참고

이다.

---

## 실제 구현 방식

### Example

```text
Benchmark UX
→ React Layout 설계
→ Tailwind Grid 구현
→ ECharts 시각화
→ Supabase 데이터 연결
```

---

## 사용 기술

```text
Next.js
React
TypeScript
TailwindCSS
Apache ECharts
Supabase
```

---

# 8. Landing Page Requirements

## 핵심 조건

### NO SCROLL

1920x1080 기준
스크롤 없이 전체 상황 인지 가능해야 함.

---

# 9. Final Landing Layout

## Updated Direction: Two-Zone Executive Overview

랜딩 페이지의 최종 방향은 기존 4분면 대시보드에서 아래 2대 Zone 중심 구조로 진화한다.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Header] Date | Sync | Life Score | Asset Score | Health Score | Risk  │
├───────────────────────────────────┬────────────────────────────────────┤
│ [Asset Zone]                      │ [Health Zone]                      │
│ - 나의 전재산 구성(Pie/Donut)       │ - 현재 건강 전체 현황                │
│ - 부동산/연금/투자/부채 분석 Tabs   │ - 관리 필요 항목 우선순위             │
│ - 나이별 연금 Timeline             │ - 세부 트래킹 Trend                  │
│ - 절세/월 1,000만원 목표 제안       │ - 특이점/주의/모니터링 Action         │
├───────────────────────────────────┴────────────────────────────────────┤
│ [AI Executive Summary] 자산 상태와 건강 리스크를 연결한 핵심 요약        │
└────────────────────────────────────────────────────────────────────────┘
```

### Asset Zone 핵심 요구

* 나의 전재산 구성을 Pie/Donut Chart로 보여준다.
* 자산별 상세 분석 탭을 제공한다:
  * 부동산
  * 연금
  * 투자
  * 부채
  * 세금
  * 시나리오
* 미래가치 기준 나이별 연금 Timeline을 제공한다.
* 연금 구성 내용과 월 환산 cashflow를 보여준다.
* 각 연금/자산별 절세 가능성과 관리 포인트를 보여준다.
* 월 1,000만원 cashflow 구성을 위한 gap과 데이터 기반 제안을 보여준다.
* 데이터가 부족한 항목은 "추가 데이터 필요"로 명확히 표시한다.

### Health Zone 핵심 요구

* 현재 건강 전체 현황과 Health Score를 보여준다.
* 현재 관리가 필요한 항목을 우선순위로 보여준다.
* BMI, 혈당, 혈압, 중성지방, 지방간, 경동맥 플라크, 심혈관 위험 등 핵심 항목을 세부 트래킹한다.
* 특이점과 악화/개선 신호를 표시한다.
* 각 항목별로 조심할 것, 관리할 것, 지속 모니터링할 것을 보여준다.
* 정기 재검/추적 일정이 필요한 항목을 Action으로 표시한다.

### Legacy 4-Zone Reference

아래 4분면 구조는 초기 prototype reference로 유지하되, 최종 Overview는 Two-Zone 구조를 우선한다.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Header] 2026-05-24 | Age: 4X | Sync: 3m ago | Life Score: 88 (▲2)    │
│ Health: 82 | Finance: 94 | Risk: Low           [Alert: Spending Warn] │
├───────────────────────────────────┬────────────────────────────────────┤
│ [Health Zone]                     │ [Finance & Investment Zone]        │
│ - Weight/Sleep Trend              │ - Net Worth Trend                  │
│ - HR / Activity Matrix            │ - Investment Treemap               │
├───────────────────────────────────┼────────────────────────────────────┤
│ [Spending Zone]                   │ [Retirement & Tax Zone]            │
│ - Budget vs Actual                │ - Pension Cashflow                 │
│ - Category Donut                  │ - Tax Timeline                     │
├───────────────────────────────────┴────────────────────────────────────┤
│ [AI Executive Summary & Action Item]                                   │
│ "자산은 증가했으나 최근 수면 부족으로 건강지표 하락 위험 감지."         │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 10. Header System

## Header Components

### Left

* 현재 날짜
* 현재 나이
* Last Sync Time

### Center

* Life Score
* Health Score
* Financial Stability Score

### Right

* Alert Badge
* Risk Indicator
* Goal Progress

---

# 11. Family Shared Architecture (RBAC)

## 문제

건강 데이터와 소비 데이터는 개인 데이터다.

따라서:

* 통합 저장만 하면 안 됨
* 사용자 분리 필요

---

# 사용자 구조

```text
USER_JH
USER_YR
FAMILY_COMBINED
```

---

# UI 토글

상단 토글 제공:

```text
[전체]
[JH]
[YR]
```

---

# 기본 정책

| 영역 | 기본값 |
| -- | --- |
| 소비 | 전체  |
| 자산 | 전체  |
| 건강 | 개인  |
| 투자 | 전체  |

---

# 12. Life Score System

## 목적

단순 KPI가 아니라:
삶 전체의 상태를 요약하는 통합 점수 시스템.

---

# 구성

## Health Score

기반:

* 수면
* 활동량
* 혈압
* 혈당
* 체중
* 심박수

---

## Financial Stability Score

기반:

* 순자산 증가율
* 소비 안정성
* 부채 비율
* 투자 변동성

---

## Life Risk Index

새롭게 추가되는 핵심 개념.

---

# 목적

건강과 자산의 균형 분석.

---

# 예시 로직

```text
자산 증가
+
수면 감소
+
심박 변동성 증가
=
Life Risk 증가
```

---

# Alert Example

```text
[경고]
최근 자산 증가율은 +12%이나,
최근 2주 평균 수면시간이 15% 감소했습니다.
과로 위험 가능성이 있습니다.
```

---

# 13. Health Dashboard

# 데이터 소스

## CSV

* health_key_yearly_metrics.csv
* health_detailed_2024_2026_metrics.csv

## API

* Samsung Health SDK

---

# Samsung Health Integration

## 지원 데이터

* 걸음수
* 심박수
* 수면
* 운동
* 칼로리
* 체중
* 활동량
* 스트레스

---

# Android 연동 구조

```text
Samsung Health SDK
→ Android Sync Service
→ Supabase API
→ PostgreSQL
→ Dashboard
```

---

# 동기화 정책

| 항목          | 정책    |
| ----------- | ----- |
| Health Sync | Daily |
| 수동 Sync     | 지원    |
| 실패 로그       | 저장    |
| 마지막 Sync    | 표시    |

---

# Health Visualization

## 사용 차트

* Multi-line Trend
* Sleep Heatmap
* Activity Matrix
* Heart-rate Trend
* Range Band

---

# Tooltip Example

```text
2026-05-24
수면: 6h 12m
걸음수: 10,421
심박수: 71
전주 대비: -8%
```

---

# 14. Finance Dashboard

# 데이터 소스

## 현재 데이터

* 순자산
* 부채
* 세금
* 연금
* 투자

---

# 추가 입력

* 삼성증권 CSV
* 카드 소비 데이터

---

# 15. Samsung Securities Integration

## 현실적 제약

삼성증권 Open API 제한 가능성 존재.

따라서:
CSV 기반 전략 우선 적용.

---

# 1차 전략 (추천)

## CSV Upload

```text
Samsung Securities Export
→ CSV Upload
→ Parsing
→ DB Insert
→ Dashboard 반영
```

---

# 2차 전략

가능 시:

* Open API 연동
* OAuth 인증
* 계좌 조회

---

# 16. Investment Dashboard

## 기능

* 종목별 평가금액
* 수익률
* CAGR
* 섹터 비중
* 손익
* 자산 배분

---

# 시각화

* Treemap
* Bubble Chart
* Gain/Loss Heatmap
* Allocation Donut

---

# 17. Spending Dashboard

## 목적

카드 소비 흐름 분석.

---

# 입력 방식

## Manual Input Form

```text
날짜
카드사
카테고리
금액
메모
승인번호
```

---

# 카테고리

* 식비
* 교통
* 쇼핑
* 건강
* 보험
* 여행
* 교육
* 구독
* 기타

---

# 18. Data Center

# 목적

모든 데이터의:

* 업로드
* 수정
* 검증
* 동기화
* 상태 관리

---

# 지원 기능

## Upload

* CSV
* Excel

---

## Editable Grid

추천 라이브러리:

```text
AG-Grid Community
```

---

# 기능

* Inline Edit
* Sort
* Filter
* Search
* Validation

---

# 19. Data Pipeline Architecture

# 핵심 목표

중복 데이터 방지(Idempotency)

---

# Spending Ledger Schema

```text
transaction_hash =
거래일시
+ 금액
+ 카드사
+ 승인번호
```

Hash 생성 후:

* unique_transaction_id 저장
* 중복 Insert 방지

---

# Samsung Health Schema

## health_daily_summary

```text
Primary Key:
KST_date
```

전략:

* Upsert 기반 저장

---

# 20. Database Architecture

# Backend

## Supabase

포함:

* PostgreSQL
* Auth
* Storage
* API
* Realtime

---

# 주요 테이블

```text
users
health_daily_summary
health_checkup_metrics
networth_snapshot
investment_holdings
spending_ledger
pension_cashflow
tax_history
alerts
ai_insights
```

---

# 21. ECharts Visualization Strategy

# 핵심 목표

Dense Visualization + 빠른 인과관계 파악

---

# 핵심 기능

## axisPointer Sync

하나의 차트 Hover 시:
다른 차트도 동일 시점 Tooltip 표시.

---

# 예시

Investment 하락 시점 Hover →
동일 시점:

* Spending 증가
* 수면 감소
* 스트레스 증가

동시 표시.

---

# ECharts 연결 전략

```javascript
echarts.connect([
  healthChart,
  financeChart,
  spendingChart
])
```

---

# 추가 기능

## dataZoom Mini-map

장기 시계열 탐색 지원.

---

# 22. AI Insight System

# 목적

향후 GPT Agent 확장 준비.

---

# Landing 영역 예약

```text
[AI Executive Summary]
```

---

# 구조

Supabase Edge Functions
또는
LangChain Runtime

출력:
Markdown 기반 Insight

---

# 예시

```markdown
### 이번 주 핵심 변화

- 소비가 전월 대비 18% 증가
- 최근 수면시간 감소 추세
- 순자산은 목표치의 102% 달성
```

---

# 23. Local Caching Strategy

# 목적

5초 이내 Dashboard 로딩.

---

# 전략

## PWA 기반 캐싱

사용:

* IndexedDB
* LocalStorage

---

# 캐싱 대상

* 최근 Dashboard 데이터
* 장기 시계열
* KPI Snapshot

---

# 동작

```text
Local Cache
→ 즉시 렌더
→ Background Sync
→ 최신 데이터 업데이트
```

---

# 24. Technical Stack

# Frontend

```text
Next.js
React
TypeScript
TailwindCSS
```

---

# Visualization

```text
Apache ECharts
```

---

# Backend

```text
Supabase
PostgreSQL
```

---

# Data Grid

```text
AG-Grid Community
```

---

# Mobile/PWA

```text
PWA
IndexedDB
Service Worker
```

---

# Android Integration

```text
Samsung Health SDK
```

---

# 25. Security & Privacy

## 중요 원칙

모든 데이터는 개인 데이터.

---

# 정책

* HTTPS 강제
* Supabase Auth
* Row Level Security (RLS)
* User-based filtering
* 암호화 저장

---

# 26. Future Expansion

## AI 기능

* 이상 탐지
* 소비 예측
* 건강 위험 예측
* 투자 위험 분석
* GPT Agent
* Voice Query

---

## Integration

* 삼성증권 API
* 카드 자동 연동
* SmartThings
* Galaxy Watch

---

# 27. Final Product Identity

이 시스템은:

* 단순 Dashboard가 아니다.
* 단순 가계부도 아니다.
* 단순 건강앱도 아니다.

최종 정체성은:

> "삶 전체를 데이터 기반으로 운영하는 Samsung Galaxy 기반 Personal Life OS"

이다.

---

# 28. Success Criteria

## UX

* 5초 이내 상태 인지
* 스크롤 없는 Overview
* Drill-down 가능

---

## Technical

* 3초 이내 초기 렌더
* Daily Health Sync 성공률 95% 이상
* CSV 중복 업로드 방지

---

## User

* 배우자 공유 가능
* 장기 데이터 누적 가능
* 실사용 가능 수준

---

# 29. Appendix — Existing Data Sources

## Health

* health_key_yearly_metrics.csv
* health_detailed_2024_2026_metrics.csv
* health_findings_actions.csv

---

## Finance

* finance_net_worth_snapshot.csv
* finance_pension_cashflow_by_year.csv
* finance_pension_products.csv
* finance_salary_tax_yearly.csv
* finance_tax_by_year_type.csv
* finance_tax_payments.csv
* finance_investment_holdings.csv
* finance_debt_loan_snapshot.csv

---

# 30. Final UX Goal

사용자가 Dashboard를 열었을 때:

> "내 삶 전체가 하나의 운영체계처럼 보인다"

라는 느낌을 받아야 한다.

그리고:

* 건강
* 자산
* 소비
* 은퇴
* 리스크
* 장기 변화

를 직관적으로 이해할 수 있어야 한다.


