# Cardfolio 구현 진행 및 완료 내역 (Implementation Log)

본 문서는 Cardfolio 프로젝트의 로드맵 단계별 구현 작업 내역과 주요 변경 사항을 기록하는 작업 로그입니다. 새로운 기능 구현 완료 시마다 업데이트합니다.

---

## 로드맵 1단계: 기반 구축 및 카드 메타데이터 생성 (완료)

- **React + TypeScript + Vite 프로젝트 구성**
  - Vite 기반의 React 19 + TypeScript SPA 프로젝트 스캐폴딩
  - 절대 경로 별칭(`@/*`) 설정 및 타입 체크 스크립트(`npm run typecheck`) 구성
- **카드 이미지 및 데이터 파이프라인 구성**
  - `images/` 디렉터리 내 20개 부스터팩, 총 2,370장의 WebP 이미지 파일 연동
  - `scripts/build-card-data.ts` 스크립트를 작성하여 이미지 디렉터리 구조를 분석하고 `src/data/cards.json` 메타데이터 자동 생성
  - Vite 커스텀 플러그인(`cardfolio-images`)을 통해 개발 서버(`/images/...`) 프록시 및 프로덕션 빌드 복사(`dist/images`) 구현

---

## 로드맵 2단계: 부스터팩 선택, 카드 그리드, 이미지 표시 (완료)

- **7대 시리즈 부스터팩 카테고리 정렬 및 셀렉터**
  - 공식 사이트 분류 및 사용자 지정 순서에 맞춘 7대 카테고리 그룹화 유틸리티(`src/utils/packCategories.ts`) 구현
    1. 아이돌마스터
    2. 아이돌마스터 신데렐라 걸즈
    3. 아이돌마스터 밀리언라이브
    4. 아이돌마스터 SIDE M
    5. 아이돌마스터 샤이니 컬러즈
    6. 학원 아이돌마스터
    7. 프리미엄 팩 시리즈
  - `<optgroup>` 기반의 드롭다운 선택기(`PackSelector.tsx`) 구현
- **반응형 카드 그리드 및 지연 로딩**
  - 카드 타일 내 파일명이나 불필요한 텍스트 없이 순수 카드 이미지만 렌더링하도록 UI 구성 (`CardTile.tsx`, `CardGrid.tsx`)
  - TCG 카드 표준 종횡비(5:7, 0.714) 적용 및 이미지 스켈레톤 로딩/에러 처리
  - 브라우저 너비에 따라 열 수가 자동으로 조절되는 반응형 CSS Grid 구축
- **라이트박스 모달 확대 뷰어**
  - 카드 클릭 시 고화질 원본 비율을 감상할 수 있는 라이트박스 모달(`CardModal.tsx`) 구현 (ESC 키 및 배경 클릭으로 닫기 지원)

---

## 로드맵 3단계: 보유 수량 영속 저장, 수집 진척도, 보유 필터 (완료)

- **Zustand 기반 보유 수량 영속 저장**
  - `useCollectionStore.ts`: `persist(localStorage)` 미들웨어를 사용하여 브라우저 로컬 저장소(`cardfolio-collection-storage`)에 보유 수량 영속 보관
  - 수량 증가(`increment`), 감소(`decrement`), 직접 설정(`setQuantity`), 팩 단위 초기화 기능 구현
- **수량 조절 컨트롤러 (`QuantityControl.tsx`)**
  - `+/-` 버튼과 직접 숫자 입력(0~999)을 모두 지원
  - 카드 타일 내 클릭 이벤트 버블링 차단(`stopPropagation`)으로 모달 오픈과 수량 조절 동작 분리
- **보유/미보유 시각적 구분**
  - 보유 카드(수량 ≥ 1): 풀컬러 표시 및 우상단 보유 수량 뱃지(`×N`) 노출
  - 미보유 카드(수량 = 0): 회색조(grayscale) 및 반투명 처리, 호버 시 불투명도 일부 복원
- **팩별 수집 진척도 프로그레스 바 (`CollectionProgress.tsx`)**
  - 수집 기준: 카드 **종류** 기준 (보유 수량이 1 이상인 카드 수 ÷ 팩 전체 카드 수)
  - 퍼센트(%) 및 수집 종수 / 총 보유 매수 통계 시각화
- **카드 목록 필터링 탭 (`CollectionFilter.tsx`)**
  - `전체` / `보유 카드` / `미보유 카드` 3가지 모드 토글 지원 및 각 상태별 실시간 카드 개수 뱃지 표시

---

## 로드맵 4단계: 위시 리스트와 목표 수량 관리 (완료)

- **위시리스트 영속 상태 스토어 (`useWishlistStore.ts`)**
  - Zustand의 `persist(localStorage)` 미들웨어를 사용하여 `cardfolio-wishlist-storage` 키로 브라우저에 영속 보관
  - 카드 ID별 목표 수량 관리, 위시 토글(`toggleWishlist`), 목표 수량 수정(`setWishQuantity`), 개별/전체 삭제(`removeFromWishlist`, `clearWishlist`) 기능 구현
- **React Router 기반 화면 전환 (`App.tsx`)**
  - `react-router-dom` 패키지 도입
  - 상단 전역 내비게이션 바 구성:
    - **카드 목록** (`/`)
    - **위시 리스트** (`/wishlist`, 등록된 위시 카드 수 실시간 뱃지 표시)
- **카드 타일 및 모달 연동 (`CardTile.tsx`, `CardModal.tsx`)**
  - **카드 타일**: 호버 시 좌측 하단에 하트 버튼(♡/♥) 노출 (이미 추가된 카드는 항상 ♥ 표시 및 활성화 색상 유지)
  - **라이트박스 모달**: 모달 하단에 위시리스트 추가/제거 토글 버튼 제공
- **위시리스트 전용 화면 (`WishlistPage.tsx`, `WishlistGrid.tsx`, `WishlistTile.tsx`)**
  - 등록된 카드를 부스터팩 카테고리 순서대로 그리드 렌더링
  - 카드 타일 클릭 시 원본 고화질 라이트박스 모달 오픈
  - 하단에서 소속 팩 명칭 확인, 목표 수량 조절(`+/-` 및 직접 입력), 개별 삭제(✕), 전체 비우기 버튼 지원
- **부스터팩 선택 상태 영속 유지 (`useCollectionStore.ts`, `CardListPage.tsx`)**
  - 마지막으로 선택된 부스터팩 ID(`selectedPackId`)를 전역 Zustand 로컬 스토리지 스토어에 보관
  - 카드 목록 ↔ 위시 리스트 간 탭 이동 시 또는 새로고침 시에도 기존에 선택했던 부스터팩이 그대로 유지되도록 개선
- **스타일 및 다크 테마 완성**
  - `src/styles/app.css`에 글로벌 nav, 위시 버튼, 위시리스트 전용 그리드/타일 스타일 반영
  - `npm run typecheck` 및 `npm run build` 검증 통과

---

## 로드맵 5단계: 위시 리스트 PNG 미리보기·다운로드 및 반응형 점검 (예정)

- 위시 리스트 화면을 카드 이미지와 목표 수량이 포함된 PNG 이미지로 생성 및 다운로드 (`html-to-image`)
- 모바일/태블릿 등 다양한 해상도에서의 최종 레이아웃 점검
