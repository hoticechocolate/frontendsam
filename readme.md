# 빙하 이미지 변화 웹사이트 개발 하네스

## 1. 프로젝트 개요

이 프로젝트는 2005년부터 2025년까지의 월별 빙하 이미지를 사용하여 빙하가 시간에 따라 어떻게 녹아가는지 시각적으로 보여주는 React 기반 웹사이트이다.

초기 단계에서는 백엔드, Supabase, Vercel 연동 없이 프론트엔드 코드와 정적 이미지 탐색 구조를 먼저 구성한다. 이후 CNN 모델이 완성되면 2026년도 빙하 SIC 지수 예측 이미지를 추가 업데이트할 예정이다.

## 2. 개발 목적

- 빙하의 변화 과정을 이미지 기반으로 직관적으로 보여준다.
- 2005년부터 2025년까지 월별 이미지를 탐색할 수 있는 화면을 만든다.
- 향후 Supabase Storage, Vercel 배포, CNN 예측 이미지 업데이트가 가능하도록 확장 가능한 구조를 잡는다.

## 3. 개발 일정

### 전체 목표

- 10월 30일까지 웹사이트 제작 완료

### 1차 목표

- 10월 10일까지 프론트엔드 코드 작업
- Supabase 작업은 진행하지 않음
- Vercel 연동도 진행하지 않음
- `src/assets/images` 폴더 기준으로 이미지 네비게이터 구성

## 4. 기술 스택

- React
- JavaScript 또는 JSX
- CSS
- 추후 Supabase Storage 연동 예정
- 추후 Vercel 배포 예정

## 5. 초기 폴더 구조

```txt
src/
├─ assets/
│  └─ images/
├─ components/
├─ pages/
├─ hooks/
├─ services/ 또는 api/
├─ styles/
├─ utils/
├─ App.jsx
└─ main.jsx
```

## 6. 이미지 데이터 구조

대시보드 지도 이미지는 로컬 파일 또는 외부 공개 저장소 URL을 사용할 수 있다.

이미지 범위:

- 시작 연도: 2005년
- 종료 연도: 2025년
- 단위: 월별 이미지
- 예상 이미지 수: 약 240장

### 로컬 이미지

로컬 이미지는 다음 구조로 저장한다. `sic`은 해빙 농도, `tos`는 해수면
온도, `tas`는 지표면 기온을 의미한다.

```txt
src/assets/maps/
├─ sic/
│  ├─ 01/
│  │  ├─ 2005.png
│  │  └─ 2025.png
│  └─ 12/
│     └─ 2025.png
├─ tos/
└─ tas/
```

월 폴더는 `01`, `09_september`, `12월`처럼 숫자로 시작하거나 영문 월 이름을
포함해도 된다. 변수 폴더 없이 `src/assets/maps/09/2025.png`로 저장하면
해빙 농도(`sic`) 이미지로 처리한다. 로컬 파일이 있으면 외부 URL보다 우선한다.

### 외부 저장소 또는 데이터베이스 링크

Supabase Storage, CDN처럼 이미지에 직접 접근 가능한 공개 주소는 환경 변수로
연결한다.

```env
# 기본 규칙: {기본주소}/{variable}/{month2}/{year}.png
VITE_MAP_IMAGE_BASE_URL=https://example.supabase.co/storage/v1/object/public/maps

# 파일 확장자가 png가 아닌 경우
VITE_MAP_IMAGE_EXTENSION=webp
```

저장소의 폴더 형식이 다르면 URL 템플릿을 사용한다.

```env
VITE_MAP_IMAGE_URL_TEMPLATE=https://example.com/maps/{month2}/{year}-{variable}.{extension}
VITE_MAP_IMAGE_EXTENSION=png
```

사용 가능한 템플릿 값은 `{variable}`, `{year}`, `{month}`, `{month2}`,
`{extension}`이다. 예를 들어 2025년 9월 해빙 농도는 각각 `sic`, `2025`,
`9`, `09`, `png`로 치환된다. 이미지가 없거나 URL 요청이 실패하면 화면이
깨지지 않고 기존 Canvas 샘플 지도가 표시된다.

## 7. 프론트엔드 초기 구현 범위

10월 10일까지는 다음 기능을 우선 구현한다.

- React 프로젝트 기본 세팅
- `src/assets/images` 폴더 생성
- 월별 이미지 데이터 목록 구성
- 연도 선택 기능
- 월 선택 기능
- 이전/다음 이미지 이동 기능
- 현재 선택된 연도와 월 표시
- 선택된 빙하 이미지 화면 출력
- 향후 Supabase 이미지 URL로 교체할 수 있도록 이미지 데이터 구조 분리

## 8. 주요 컴포넌트 예시

```txt
components/
├─ ImageViewer.jsx
├─ TimelineNavigator.jsx
├─ YearSelector.jsx
└─ MonthSelector.jsx
```

컴포넌트 역할:

- `ImageViewer.jsx`: 선택된 빙하 이미지를 보여주는 컴포넌트
- `TimelineNavigator.jsx`: 이전/다음 월 이동 및 전체 타임라인 제어
- `YearSelector.jsx`: 연도 선택
- `MonthSelector.jsx`: 월 선택

## 9. 페이지 구성 예시

```txt
pages/
└─ GlacierTimelinePage.jsx
```

페이지 역할:

- 빙하 이미지 탐색 화면의 메인 페이지
- 이미지 뷰어와 네비게이터 컴포넌트를 조합
- 현재 선택된 연도, 월, 이미지 경로 상태 관리

## 10. 데이터 관리 방식

초기에는 정적 이미지 경로를 사용한다.

```js
const glacierImages = [
  {
    year: 2005,
    month: 1,
    src: "/src/assets/images/glacier-2005-01.png",
  },
  {
    year: 2005,
    month: 2,
    src: "/src/assets/images/glacier-2005-02.png",
  },
];
```

추후 Supabase Storage 연동 시에는 `src` 값을 Supabase 이미지 URL로 교체한다.

## 11. Supabase 연동 계획

초기 프론트엔드 작업 기간에는 Supabase 작업을 하지 않는다.

추후 작업 범위:

- Supabase 프로젝트 생성
- Storage bucket 생성
- 2005~2025 월별 이미지 업로드
- 이미지 URL 조회 API 또는 서비스 함수 작성
- React 프론트엔드에서 Supabase Storage 이미지 호출
- 기존 `src/assets/images` 기반 구조를 Supabase URL 기반 구조로 교체

## 12. Vercel 연동 계획

Supabase Storage 연동 이후 Vercel 배포를 진행한다.

추후 작업 범위:

- Vercel 프로젝트 생성
- GitHub 저장소 연동
- 환경 변수 설정
- 배포 테스트
- 외부 접속 가능한 URL 생성

## 13. CNN 모델 연동 계획

CNN 모델 완성 이후에는 2026년도 빙하 SIC 지수 예측 이미지를 추가한다.

추후 작업 범위:

- 2026년 예측 이미지 생성
- 월별 예측 이미지 저장
- 기존 이미지 탐색 데이터에 2026년 데이터 추가
- 실제 관측 이미지와 예측 이미지 구분 표시
- SIC 지수 설명 및 예측 결과 표시 기능 추가 검토

## 14. 작업 우선순위

1. React 프로젝트 초기 세팅
2. 폴더 구조 생성
3. `src/assets/images` 폴더 생성
4. 이미지 파일명 규칙 확정
5. 월별 이미지 목록 데이터 생성
6. 이미지 뷰어 구현
7. 연도/월 네비게이터 구현
8. 반응형 UI 정리
9. Supabase 연동을 고려한 데이터 구조 분리
10. 이후 Supabase Storage 및 Vercel 배포 진행

## 15. 현재 단계에서 하지 않을 작업

- Supabase 프로젝트 생성
- Supabase Storage 업로드
- Supabase API 연동
- Vercel 배포
- CNN 모델 연동
- 2026년도 예측 이미지 반영

## 16. 최종 목표

사용자는 웹사이트에서 2005년부터 2025년까지의 월별 빙하 이미지를 선택하며 빙하가 시간에 따라 녹아가는 변화를 확인할 수 있다.

이후 2026년도 CNN 예측 이미지를 추가하여 과거 변화와 미래 예측을 함께 보여주는 빙하 변화 시각화 웹사이트로 확장한다.
