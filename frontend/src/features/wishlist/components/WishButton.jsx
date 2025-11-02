/**
 * ============================================================================
 * WishButton.jsx - 위시리스트 토글 버튼 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 상품을 위시리스트에 추가/제거하는 하트 버튼
 * - 상품 카드, 상품 상세 페이지 등 여러 곳에서 재사용 가능
 * - 낙관적 UI 업데이트(Optimistic UI) 패턴 적용
 *
 * 【주요 기능】
 * 1. **시각적 토글**: 하트 아이콘 채움/비움 애니메이션
 * 2. **낙관적 업데이트**: 서버 응답 전에 UI 먼저 변경 (빠른 UX)
 * 3. **에러 롤백**: 작업 실패 시 이전 상태로 복구
 * 4. **중복 클릭 방지**: pending 상태로 연속 클릭 차단
 * 5. **접근성 지원**: aria-label, aria-pressed 속성
 *
 * 【낙관적 UI 패턴】
 * 1. 사용자 클릭 → 즉시 하트 채움/비움 (UI 먼저 변경)
 * 2. 백그라운드에서 onToggle 비동기 호출
 * 3. 성공 시 그대로 유지
 * 4. 실패 시 이전 상태로 롤백
 *
 * 이렇게 하면 네트워크 지연 없이 즉각적인 피드백을 제공할 수 있습니다.
 *
 * 【Props】
 * @param {string} productId - 상품 고유 ID
 * @param {boolean} isWished - 현재 위시리스트에 포함 여부
 * @param {Function} onToggle - 토글 콜백 (productId, newState, product) => Promise
 * @param {Object} product - 상품 전체 정보 객체
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect, useState } from "react";

/**
 * WishButton 함수형 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @returns {JSX.Element} 하트 버튼 UI
 */
export default function WishButton({ productId, isWished, onToggle, product }) {
  /** on - 위시리스트 활성화 상태 (하트 채움 여부) */
  const [on, setOn] = useState(!!isWished);

  /** pending - 비동기 작업 진행 중 여부 (중복 클릭 방지용) */
  const [pending, setPending] = useState(false);

  /**
   * isWished prop 변경 시 내부 상태 동기화
   *
   * @description
   * 부모 컴포넌트에서 isWished가 변경되면 버튼 상태도 업데이트합니다.
   * 예: 다른 탭에서 위시리스트 변경 시 반영
   */
  useEffect(() => setOn(!!isWished), [isWished]);

  /**
   * handleToggle - 위시리스트 토글 이벤트 핸들러
   *
   * @description
   * 하트 버튼 클릭 시 다음 순서로 처리됩니다:
   *
   * 1. **이벤트 전파 차단**: e.stopPropagation() (카드 클릭 이벤트 방지)
   * 2. **중복 클릭 방지**: pending 상태 확인
   * 3. **낙관적 UI 업데이트**: 즉시 하트 채움/비움 (서버 응답 전)
   * 4. **비동기 작업 실행**: onToggle() 호출
   * 5. **성공**: 변경 유지
   * 6. **실패**: 이전 상태로 롤백 + 에러 로깅
   *
   * @param {Event} e - 클릭 이벤트 객체
   *
   * @example
   * // 사용 예시 (ProductCard.jsx)
   * <WishButton
   *   productId={product.id}
   *   isWished={wishlist.includes(product.id)}
   *   onToggle={async (id, state, prod) => {
   *     if (state) {
   *       await addToWishlist(prod);
   *     } else {
   *       await removeFromWishlist(id);
   *     }
   *   }}
   *   product={product}
   * />
   */
  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    setOn((prev) => !prev);

    try {
      await onToggle(productId, !on, product);
    } catch (err) {
      setOn((prev) => !prev);
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`wishlist-btn ${on ? "on" : ""}`}
      aria-pressed={on}
      aria-label={on ? "위시 제거" : "위시에 추가"}
      onClick={handleToggle}
      disabled={pending}
    >
      <svg className="heart" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 17.25s-6.25-3.75-8.125-7.5C.625 6.5 2.75 4 5.25 4 7.1 4 8.3 5 10 6.9 11.7 5 12.9 4 14.75 4c2.5 0 4.625 2.5 3.375 5.75C16.25 13.5 10 17.25 10 17.25z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
        />
      </svg>
    </button>
  );
}
