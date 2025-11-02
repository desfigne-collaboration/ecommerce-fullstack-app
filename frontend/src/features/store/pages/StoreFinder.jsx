/**
 * ============================================================================
 * StoreFinder.jsx - 매장 찾기 페이지
 * ============================================================================
 *
 * 【목적】
 * - 오프라인 매장 위치 및 정보 제공
 * - 다양한 지도 플랫폼으로 길찾기 링크 제공 (네이버, 카카오, 구글)
 * - 주소 복사 기능으로 편리한 매장 위치 공유
 *
 * 【주요 기능】
 * 1. **주소 복사**: Clipboard API 사용 (fallback으로 execCommand 지원)
 * 2. **지도 임베드**: Google Maps iframe으로 매장 위치 표시
 * 3. **멀티 플랫폼 길찾기**: 네이버 지도, 카카오맵, 구글 지도 링크 제공
 * 4. **영업 시간 표시**: 평일/주말 영업 시간 안내
 * 5. **반응형 레이아웃**: 모바일/데스크톱 대응 그리드 레이아웃
 *
 * 【매장 정보】
 * - 매장명: "더좋은강남아카데미"
 * - 위치: 4층
 * - 영업시간: 평일 10:00 ~ 19:00 (주말/공휴일 휴무)
 *
 * 【기술 구현】
 * - Clipboard API: navigator.clipboard.writeText()
 * - Fallback: document.execCommand('copy')
 * - URL 인코딩: encodeURIComponent()로 주소 안전하게 전달
 * - Google Maps Embed API: iframe으로 지도 표시
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useMemo, useState } from "react";
import "./StoreFinder.css";

/**
 * StoreFinder - 매장 찾기 페이지 컴포넌트
 *
 * @description
 * 오프라인 매장의 위치, 영업 시간, 길찾기 링크를 제공하는 페이지입니다.
 *
 * 【레이아웃 구조】
 * 1. store-crumb: 경로 표시 (Home > 매장찾기)
 * 2. store-hero: 히어로 섹션 (제목, 설명, 오로라 배경)
 * 3. store-card: 매장 정보 카드
 *    - store-card-head: 매장명 및 층수
 *    - store-info-grid: 주소/영업시간 + 지도 (2열 그리드)
 *    - cta-wrap: 네이버/카카오/구글 길찾기 버튼
 *    - store-map: Google Maps iframe
 *    - store-tips: 이용 팁
 *
 * 【상태 관리】
 * - copied: 주소 복사 완료 여부 (1.5초 후 자동 리셋)
 * - encoded: useMemo로 URL 인코딩된 주소 (재계산 방지)
 *
 * 【주소 복사 로직】
 * 1. Clipboard API 시도 (모던 브라우저)
 * 2. 실패 시 document.execCommand fallback (구형 브라우저)
 * 3. 성공 시 copied 상태 true로 변경 (1.5초 후 false)
 *
 * 【길찾기 링크】
 * - 네이버: `https://map.naver.com/p/search/{encoded}`
 * - 카카오: `https://map.kakao.com/?q={encoded}`
 * - 구글: `https://www.google.com/maps/search/?api=1&query={encoded}`
 *
 * @returns {JSX.Element} 매장 찾기 페이지 전체 레이아웃
 *
 * @example
 * // App.jsx 또는 라우터에서 사용:
 * <Route path="/store" element={<StoreFinder />} />
 */
export default function StoreFinder() {
  const name = "더좋은강남아카데미";
  const floor = "4층";
  const address = `${name} ${floor}`;

  /**
   * encoded - URL 인코딩된 주소
   *
   * @description
   * useMemo로 메모이제이션하여 불필요한 재계산을 방지합니다.
   * 한글 주소를 URL 인코딩하여 지도 플랫폼에 안전하게 전달합니다.
   */
  const encoded = useMemo(() => encodeURIComponent(address), [address]);
  const [copied, setCopied] = useState(false);

  /**
   * copyAddr - 주소 복사 함수
   *
   * @description
   * Clipboard API를 사용하여 주소를 클립보드에 복사합니다.
   * Clipboard API가 지원되지 않는 브라우저에서는 document.execCommand fallback을 사용합니다.
   *
   * 【처리 흐름】
   * 1. navigator.clipboard.writeText() 시도
   * 2. 성공 시: copied 상태 true, 1.5초 후 false
   * 3. 실패 시: textarea 요소 생성 → 복사 → 제거
   *
   * 【Fallback 동작】
   * - textarea 생성 및 주소 value 설정
   * - document.body에 추가
   * - select() 및 execCommand('copy') 실행
   * - textarea 제거
   *
   * @async
   * @returns {Promise<void>}
   *
   * @example
   * <button onClick={copyAddr}>주소복사</button>
   */
  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="store-wrap">
      <div className="store-crumb">Home  ›  매장찾기</div>

      <section className="store-hero">
        <div className="aurora" aria-hidden="true" />
        <h1 className="store-title">매장찾기</h1>
        <p className="store-sub">
          가장 가까운 경로로 안내해 드릴게요. 아래 길찾기 버튼을 눌러 이동앱을 선택하세요.
        </p>
      </section>

      <section className="store-card">
        <div className="store-card-head">
          <div className="store-pin" aria-hidden="true">📍</div>
          <div className="store-name">
            <strong>{name}</strong>
            <span className="store-floor">{floor}</span>
          </div>
        </div>

        <div className="store-info-grid">
          <div className="store-info">
            <div className="info-row">
              <span className="info-key">주소</span>
              <span className="info-val">{address}</span>
              <button className="mini-btn" onClick={copyAddr}>
                {copied ? "복사됨!" : "주소복사"}
              </button>
            </div>

            <div className="info-row">
              <span className="info-key">영업시간</span>
              <span className="info-val">평일 10:00 ~ 19:00 (주말/공휴일 휴무)</span>
            </div>

            <div className="cta-wrap">
              <a
                className="cta-btn naver"
                href={`https://map.naver.com/p/search/${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                네이버 지도로 길찾기
              </a>
              <a
                className="cta-btn kakao"
                href={`https://map.kakao.com/?q=${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                카카오맵으로 길찾기
              </a>
              <a
                className="cta-btn google"
                href={`https://www.google.com/maps/search/?api=1&query=${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                구글 지도로 길찾기
              </a>
            </div>
          </div>

          <div className="store-map">
            {/* 구글 지도 임베드: 검색 결과 뷰 */}
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encoded}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="store-tips">
          🚗 자차 이용 시 목적지를 <b>{address}</b>로 설정해주세요.
          대중교통 이용 시, 네이버/카카오 길찾기에서 실시간 환승 정보를 확인할 수 있어요.
        </div>
      </section>
    </div>
  );
}
