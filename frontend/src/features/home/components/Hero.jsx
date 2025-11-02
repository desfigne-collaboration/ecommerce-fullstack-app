/**
 * ============================================================================
 * Hero.jsx - 홈 히어로 배너 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 홈 페이지 상단 메인 히어로 배너 표시
 * - 주요 프로모션 이벤트 이미지 및 텍스트 노출
 *
 * 【주요 기능】
 * 1. **배너 이미지**: 외부 CDN에서 가져온 프로모션 이미지
 * 2. **오버레이 텍스트**: 이벤트 제목 및 기간 표시
 * 3. **반응형 디자인**: CSS로 다양한 화면 크기 대응
 *
 * 【디자인 패턴】
 * - 이미지 위에 텍스트 오버레이
 * - Hero.css에서 스타일 관리
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import "./Hero.css";

/**
 * Hero 함수형 컴포넌트
 *
 * @description
 * 홈 페이지 최상단에 표시되는 히어로 배너.
 * SSF 10주년 파티 이벤트 이미지와 기간을 표시합니다.
 *
 * 【처리 흐름】
 * 1. **이미지 렌더링**: CDN에서 프로모션 이미지 로드
 * 2. **텍스트 오버레이**: 이벤트 제목과 기간 표시
 *
 * @returns {JSX.Element} 히어로 배너 UI
 */
export default function Hero() {
  return (
    <section className="hero">
      <img
        src="https://image.ssfshop.com/upload/banner/2025-ssf-main.jpg"
        alt="SSF 이벤트"
      />
      <div className="hero-text">
        <h2>SSF 10th PARTY</h2>
        <p>9.22 10:00 ~ 10.13 09:59</p>
      </div>
    </section>
  );
}
