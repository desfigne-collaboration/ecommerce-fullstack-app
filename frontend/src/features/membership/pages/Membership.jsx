/**
 * ============================================================================
 * Membership.jsx - 멤버십 안내 페이지
 * ============================================================================
 *
 * 【목적】
 * - SSF SHOP 멤버십 등급별 혜택 안내
 * - 등급 산정 기준 및 승급 조건 설명
 * - 고객의 멤버십 활용 유도 및 충성도 강화
 *
 * 【멤버십 등급】
 * 1. **DIAMOND**: 3,000만원 이상 (최상위)
 * 2. **PLATINUM**: 1,000만원 이상
 * 3. **GOLD**: 300만원 이상
 * 4. **SILVER**: 100만원 이상
 * 5. **BRONZE**: 50만원 이상
 * 6. **FAMILY**: 1회 이상 구매 (기본)
 *
 * 【주요 혜택】
 * - 멤버십포인트 적립
 * - 분기별 기프트포인트 (1만G ~ 50만G)
 * - 생일축하 금액권 (1만원 ~ 10만원)
 * - 무료 AS 수선서비스 (1년 ~ 무제한)
 * - 무료반품 쿠폰
 * - VIP 전담 상담 (Silver 이상)
 * - 오프라인 매장 할인권 (Gold 이상)
 * - DIAMOND 기프티 (Diamond만)
 *
 * 【데이터 구조】
 * - TIERS 배열: 6개 등급 정보
 *   - key: 등급 식별자 (diamond, platinum, gold, silver, bronze, family)
 *   - name: 등급명 (예: "DIAMOND")
 *   - badge: 배지 문자 (예: "D")
 *   - criteria: 등급 산정 기준 (예: "3,000만원 이상")
 *   - benefits: 혜택 배열 (문자열)
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import "./Membership.css";

/**
 * TIERS - 멤버십 등급 데이터
 *
 * @description
 * 6개 멤버십 등급의 산정 기준과 혜택을 정의한 배열입니다.
 *
 * 【등급 순서】
 * 최상위부터 하위 순으로 정렬 (Diamond → Platinum → Gold → Silver → Bronze → Family)
 *
 * 【등급 산정 기준】
 * - 직전 12개월(최근 1년) 구매실적 기준
 * - 매월 20일 등급 조정
 *
 * 【혜택 차이】
 * - 상위 등급일수록 기프트포인트, 금액권, AS 기간, 무료반품 쿠폰 증가
 * - Silver 이상: VIP 전담 상담 제공
 * - Gold 이상: 오프라인 매장 할인권 제공
 * - Diamond: 연 1회 DIAMOND 기프티 제공
 */
const TIERS = [
  {
    key: "diamond",
    name: "DIAMOND",
    badge: "D",
    criteria: "3,000만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 50만G",
      "생일축하 금액권 10만원",
      "무제한 무료 AS 수선서비스",
      "매월 2매 무료반품 쿠폰",
      "VIP 전담 상담",
      "오프라인 매장 할인권 2매",
      "DIAMOND 기프티 연 1회",
    ],
  },
  {
    key: "platinum",
    name: "PLATINUM",
    badge: "P",
    criteria: "1,000만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 30만G",
      "생일축하 금액권 5만원",
      "구매일로부터 4년 이내 무료 AS 수선서비스",
      "매월 2매 무료반품 쿠폰",
      "VIP 전담 상담",
      "오프라인 매장 할인권 2매",
    ],
  },
  {
    key: "gold",
    name: "GOLD",
    badge: "G",
    criteria: "300만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 10만G",
      "생일축하 금액권 3만원",
      "구매일로부터 3년 이내 무료 AS 수선서비스",
      "매월 1매 무료반품 쿠폰",
      "VIP 전담 상담",
      "오프라인 매장 할인권 1매",
    ],
  },
  {
    key: "silver",
    name: "SILVER",
    badge: "S",
    criteria: "100만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 3만G",
      "생일축하 금액권 2만원",
      "구매일로부터 2년 이내 무료 AS 수선서비스",
      "매월 1매 무료반품 쿠폰",
      "VIP 전담 상담",
    ],
  },
  {
    key: "bronze",
    name: "BRONZE",
    badge: "B",
    criteria: "50만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 2만G",
      "생일축하 금액권 1만원",
      "구매일로부터 1년 이내 무료 AS 수선서비스",
      "분기별 1매 무료반품 쿠폰",
    ],
  },
  {
    key: "family",
    name: "FAMILY",
    badge: "F",
    criteria: "1회 이상 구매",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 1만G",
      "생일축하 금액권 1만원",
      "구매일로부터 1년 이내 무료 AS 수선서비스",
    ],
  },
];

/**
 * Membership - 멤버십 안내 페이지 컴포넌트
 *
 * @description
 * 멤버십 등급별 혜택을 테이블 형식으로 표시하는 페이지입니다.
 *
 * 【레이아웃 구조】
 * 1. mb-head: 페이지 제목 및 설명
 * 2. mb-table-scroller: 가로 스크롤 가능한 테이블 컨테이너
 * 3. mb-table: 등급별 혜택 비교 테이블
 *    - thead: 등급 헤더 (배지 + 등급명)
 *    - tbody: 등급 산정 기준 행 + 혜택 행
 * 4. mb-notes: 유의사항 안내
 *
 * 【테이블 구조】
 * - 첫 번째 열: 항목명 (등급 산정 기준, 혜택)
 * - 나머지 열: 각 등급별 데이터 (6개 등급)
 *
 * 【등급 산정】
 * - 직전 12개월(최근 1년) 구매실적 기준
 * - 매월 20일 등급 조정
 *
 * 【스타일링】
 * - 등급별 배지 색상: CSS에서 .badge.diamond, .badge.platinum 등으로 스타일링
 * - 반응형 테이블: mb-table-scroller로 가로 스크롤 대응
 *
 * @returns {JSX.Element} 멤버십 안내 페이지 전체 레이아웃
 *
 * @example
 * // App.jsx 또는 라우터에서 사용:
 * <Route path="/membership" element={<Membership />} />
 */
export default function Membership() {
  return (
    <div className="mb-wrap">
      <div className="mb-head">
        <h1>멤버십 안내</h1>
        <p className="mb-desc">
          직전 12개월(최근 1년) 구매실적을 기준으로 매월 20일 등급이 조정됩니다.
        </p>
      </div>

      <div className="mb-table-scroller">
        <table className="mb-table">
          <thead>
            <tr>
              <th className="col-title">등급</th>
              {TIERS.map((t) => (
                <th key={t.key} className="col-tier">
                  <div className={`badge ${t.key}`}>{t.badge}</div>
                  <div className="tier-name">{t.name}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* 등급 산정 기준 */}
            <tr className="row-section">
              <td className="row-title">
                <div className="title-line">등급 산정 기준</div>
                <div className="sub">매월 20일 기준 최근 1년 구매액</div>
              </td>
              {TIERS.map((t) => (
                <td key={`${t.key}-criteria`} className="cell-ctr">
                  {t.criteria}
                </td>
              ))}
            </tr>

            {/* 혜택 목록 */}
            <tr>
              <td className="row-title big">혜택</td>
              {TIERS.map((t) => (
                <td key={`${t.key}-benefits`} className="cell-benefits">
                  <ul>
                    {t.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 유의사항 */}
      <div className="mb-notes">
        <ul>
          <li>일부 프로모션/브랜드의 경우 혜택 제공이 제한될 수 있습니다.</li>
          <li>AS/쿠폰 정책은 브랜드 및 품목에 따라 달라질 수 있습니다.</li>
          <li>등급 산정 기준 및 혜택은 사전 고지 후 변경될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
