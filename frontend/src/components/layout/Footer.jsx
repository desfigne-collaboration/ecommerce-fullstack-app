/**
 * ============================================================================
 * Footer.jsx - 하단 푸터 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 모든 페이지 하단에 공통으로 표시되는 푸터 영역
 * - 회사 정보, 이용약관, 고객센터 등 주요 링크 제공
 * - 법적 고지 및 인증 정보 표시
 *
 * 【구조】
 * ┌────────────────────────────────────────┐
 * │ 회사소개 | 이용약관 | 개인정보처리방침  │  ← 상단 링크 영역
 * │ 멤버십안내 | 고객센터 | 매장찾기        │
 * ├────────────────────────────────────────┤
 * │ 회사명: 삼성물산(주)패션부문           │  ← 회사 정보
 * │ 주소: 서울 강남구...                   │
 * │ 사업자등록번호, 통신판매업 신고 등     │
 * ├────────────────────────────────────────┤
 * │ Copyright © 2025 Samsung C&T           │  ← 저작권 및 인증
 * │ ISMS 인증마크 | SNS 아이콘            │
 * └────────────────────────────────────────┘
 *
 * 【주요 기능】
 * 1. 3개 그룹으로 나뉜 푸터 링크 (좌/중/우)
 * 2. 이메일 무단수집 거부 모달 표시
 * 3. 회사 정보 및 법적 고지 표시
 * 4. ISMS 인증 정보 표시
 * 5. SNS 링크 (유튜브, 인스타그램)
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import EmailPolicyModal from "../ui/EmailPolicyModal";

// ============================================================================
// 푸터 링크 데이터
// ============================================================================
/**
 * footerLinksLeft - 좌측 링크 그룹
 *
 * @description
 * 회사 소개, 약관, 개인정보처리방침 등 주요 정책 링크
 *
 * @type {Array<{text: string, to: string, strong?: boolean, modal?: string}>}
 */
const footerLinksLeft = [
  { text: "회사소개", to: "/company" },
  { text: "이용약관", to: "/terms" },
  { text: "개인정보 처리방침", to: "/privacy", strong: true },
  // 이 항목은 페이지 이동 대신 모달로 처리
  { text: "이메일무단수집거부", to: "/email-policy", modal: "emailPolicy" },  // modal 속성: 모달 오픈
];

/**
 * footerLinksCenter - 중앙 링크 그룹
 *
 * @description
 * 멤버십, 고객센터, 매장 찾기 등 사용자 편의 서비스 링크
 *
 * @type {Array<{text: string, to: string}>}
 */
const footerLinksCenter = [
  { text: "멤버십안내", to: "/membership" },
  { text: "고객센터", to: "/help" },
  { text: "매장찾기", to: "/stores" },
  { text: "공지사항", to: "/notice" },
  { text: "단체주문", to: "/bulk-order" },
];

/**
 * footerLinksRight - 우측 링크 그룹
 *
 * @description
 * 입점 신청, 제휴 문의 등 비즈니스 관련 링크
 *
 * @type {Array<{text: string, to: string}>}
 */
const footerLinksRight = [
  { text: "입점신청", to: "/store-application" },
  { text: "제휴문의", to: "/partnership" },
];

// ============================================================================
// 회사 정보 데이터
// ============================================================================
/**
 * companyInfo - 회사 정보 객체
 *
 * @description
 * 통신판매업 신고 및 사업자 정보를 담고 있는 데이터
 * 전자상거래법에 따라 필수로 표시해야 하는 정보들입니다.
 *
 * @type {Object}
 * @property {string} name - 회사명
 * @property {string} address - 사업장 주소
 * @property {string} ceo - 대표자명
 * @property {string} businessNumber - 사업자등록번호
 * @property {string} ecommerceNumber - 통신판매업 신고번호
 * @property {string} hosting - 호스팅 서비스 제공자
 * @property {string} escrow - 에스크로 서비스 제공자
 * @property {string} escrowLink - 에스크로 확인 링크 텍스트
 * @property {string} escrowDesc - 에스크로 안내 문구
 * @property {string} phone - 대표 전화번호
 * @property {string} email - 대표 이메일
 */
const companyInfo = {
  name: "삼성물산(주)패션부문",
  address: "서울특별시 강남구 남부순환로 2806(도곡동)",
  ceo: "오세철 외 2명",
  businessNumber: "101-85-43600",
  ecommerceNumber: "제 2015-서울강남-02894",
  hosting: "삼성물산(주)패션부문",
  escrow: "KG모빌리언스 구매안전(에스크로)서비스",
  escrowLink: "서비스 가입사실 확인",
  escrowDesc:
    "고객님의 안전거래를 위해 현금 등으로 5만원 이상 결제 시 저희 쇼핑몰에서 가입한 구매안전(에스크로) 서비스를 이용하실 수 있습니다.",
  phone: "1599-0007(전국) 080-700-1472(수신자부담)",
  email: "ssfshop@samsung.com",
};

// ============================================================================
// Footer 컴포넌트
// ============================================================================
/**
 * Footer 함수형 컴포넌트
 *
 * @description
 * 애플리케이션 전역에서 사용되는 하단 푸터입니다.
 * App.js에서 모든 페이지 하단에 공통으로 표시됩니다.
 *
 * @returns {JSX.Element} Footer UI
 */
export default function Footer() {
  // 현재 연도 (Copyright 표시용)
  const currentYear = new Date().getFullYear();

  // 이메일 무단수집 거부 모달 표시 여부 상태
  const [showEmailModal, setShowEmailModal] = useState(false);

  /**
   * renderFooterLink - 푸터 링크 렌더링 함수
   *
   * @description
   * 링크 타입에 따라 다른 방식으로 렌더링합니다:
   * - modal 속성이 있는 경우: <a> 태그 + onClick으로 모달 오픈
   * - 일반 링크: React Router의 <Link> 컴포넌트 사용
   *
   * @param {Object} link - 링크 객체
   * @param {string} link.text - 링크 텍스트
   * @param {string} link.to - 링크 경로
   * @param {boolean} [link.strong] - 강조 표시 여부 (개인정보처리방침)
   * @param {string} [link.modal] - 모달 타입 (emailPolicy)
   * @param {number} index - 배열 인덱스 (key prop용)
   *
   * @returns {JSX.Element} 링크 엘리먼트
   */
  const renderFooterLink = (link, index) => {
    // 강조 표시 여부에 따른 className 설정 (개인정보처리방침은 strong 클래스 적용)
    const className = link.strong ? "strong" : "";

    // 모달 타입 링크인 경우 (이메일무단수집거부)
    if (link.modal === "emailPolicy") {
      return (
        <a
          key={index}
          href="/#/email-policy"
          className={className}
          onClick={(e) => {
            e.preventDefault(); // 페이지 이동 방지
            setShowEmailModal(true); // 모달 열기
          }}
        >
          {link.text}
        </a>
      );
    }

    // 일반 링크: React Router Link 사용
    return (
      <Link key={index} to={link.to} className={className}>
        {link.text}
      </Link>
    );
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* ==================== 상단 링크 영역 ==================== */}
        <div className="footer-top">
          <div className="footer-links-wrapper">
            {/* 왼쪽 링크 그룹 (회사소개, 약관 등) */}
            <div className="footer-links-group">
              {footerLinksLeft.map(renderFooterLink)}
            </div>

            {/* 세로 구분선 */}
            <div className="footer-divider"></div>

            {/* 중앙 링크 그룹 (멤버십, 고객센터 등) */}
            <div className="footer-links-group">
              {footerLinksCenter.map(renderFooterLink)}
            </div>

            {/* 오른쪽 링크 그룹 (입점신청, 제휴문의) */}
            <div className="footer-links-group footer-links-right">
              {footerLinksRight.map(renderFooterLink)}
            </div>
          </div>
        </div>

        {/* ==================== 회사 정보 영역 ==================== */}
        <div className="footer-content">
          <div className="company-info">
            {/* 회사명 */}
            <h3>{companyInfo.name}</h3>

            {/* 사업자 정보 1줄 */}
            <p>
              주소: {companyInfo.address} ㅣ 대표 : {companyInfo.ceo} ㅣ
              사업자 등록번호: {companyInfo.businessNumber}{" "}
              <button type="button" className="info-link" onClick={() => alert('사업자정보 조회 기능은 준비 중입니다.')}>
                사업자정보확인
              </button>{" "}
              ㅣ 통신판매업 신고번호: {companyInfo.ecommerceNumber} ㅣ 호스팅서비스:{" "}
              {companyInfo.hosting}
            </p>

            {/* 에스크로 서비스 안내 */}
            <p>
              {companyInfo.escrow}{" "}
              <button type="button" className="info-link" onClick={() => alert('에스크로 서비스 안내 페이지는 준비 중입니다.')}>
                {companyInfo.escrowLink}
              </button>{" "}
              {companyInfo.escrowDesc}
            </p>

            {/* 연락처 정보 */}
            <p>
              대표전화 {companyInfo.phone} | 이메일: {companyInfo.email}
            </p>
          </div>

          {/* ==================== 저작권 및 인증 영역 ==================== */}
          <div className="footer-bottom">
            {/* Copyright 문구 */}
            <div className="footer-bottom-left">
              <p>
                Copyright (C) {currentYear} Samsung C&T Corporation. All rights
                reserved
              </p>
            </div>

            {/* ISMS 인증 및 SNS 링크 */}
            <div className="footer-bottom-right">
              {/* ISMS 인증 마크 및 정보 */}
              <div className="certification">
                <img
                  src="https://ext.same-assets.com/947818454/209907754.png"
                  alt="ISMS 인증마크"
                />
                <p>
                  인증범위 : 패션부문 온라인 쇼핑몰 서비스 운영 (SSFSHOP, 토리버치) |
                  유효기간 : 2025.08.12 ~ 2028.08.11
                </p>
              </div>

              {/* SNS 아이콘 링크 */}
              <div className="social-icons">
                {/* 유튜브 */}
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="유튜브"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#999" />
                    <path
                      d="M24 12.3C24 12.3 23.8 10.9 23.2 10.3C22.4 9.5 21.5 9.5 21.1 9.4C18.2 9.2 16 9.2 16 9.2C16 9.2 13.8 9.2 10.9 9.4C10.5 9.5 9.6 9.5 8.8 10.3C8.2 10.9 8 12.3 8 12.3C8 12.3 8 13.9 8 15.6V17.2C8 18.9 8 20.5 8 20.5C8 20.5 8.2 21.9 8.8 22.5C9.6 23.3 10.6 23.3 11.1 23.4C12.8 23.6 16 23.6 16 23.6C16 23.6 18.2 23.6 21.1 23.4C21.5 23.3 22.4 23.3 23.2 22.5C23.8 21.9 24 20.5 24 20.5C24 20.5 24 18.9 24 17.2V15.6C24 13.9 24 12.3 24 12.3ZM14 19V13L20 16L14 19Z"
                      fill="white"
                    />
                  </svg>
                </a>

                {/* 인스타그램 */}
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="인스타그램"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#999" />
                    <path
                      d="M12 8C9.8 8 8 9.8 8 12V20C8 22.2 9.8 24 12 24H20C22.2 24 24 22.2 24 20V12C24 9.8 22.2 8 20 8H12ZM21 10C21.6 10 22 10.4 22 11C22 11.6 21.6 12 21 12C20.4 12 20 11.6 20 11C20 10.4 20.4 10 21 10ZM16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12ZM16 14C14.9 14 14 14.9 14 16C14 17.1 14.9 18 16 18C17.1 18 18 17.1 18 16C18 14.9 17.1 14 16 14Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 이메일 무단수집거부 모달 ==================== */}
      {/* showEmailModal 상태에 따라 모달 표시/숨김 처리 */}
      <EmailPolicyModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </footer>
  );
}
