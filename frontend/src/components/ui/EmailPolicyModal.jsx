/**
 * ============================================================================
 * EmailPolicyModal.jsx - 이메일 무단수집 거부 모달 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 이메일 무단수집 거부 정책을 모달 창으로 표시
 * - 정보통신망법 준수를 위한 법적 고지 제공
 * - 사용자 친화적인 모달 UI/UX 제공
 *
 * 【사용 위치】
 * - Footer.jsx: "이메일무단수집거부" 링크 클릭 시 표시
 *
 * 【기능】
 * 1. 모달 오버레이 배경 클릭 시 닫기
 * 2. ESC 키 입력 시 닫기
 * 3. 확인 버튼 클릭 시 닫기
 * 4. X 버튼 클릭 시 닫기
 *
 * 【접근성 (Accessibility)】
 * - role="dialog": 스크린 리더에 모달 역할 알림
 * - aria-modal="true": 모달이 활성화되었음을 알림
 * - aria-labelledby: 모달 제목과 연결
 * - aria-label: 닫기 버튼에 명확한 레이블 제공
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.open - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 콜백 함수
 *
 * @example
 * // Footer.jsx에서 사용 예시
 * const [showModal, setShowModal] = useState(false)
 *
 * <button onClick={() => setShowModal(true)}>
 *   이메일무단수집거부
 * </button>
 *
 * <EmailPolicyModal
 *   open={showModal}
 *   onClose={() => setShowModal(false)}
 * />
 *
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect } from "react";
import "../layout/EmailPolicyModal.css";

export default function EmailPolicyModal({ open, onClose }) {
  /**
   * ESC 키 입력 이벤트 핸들러 설정
   *
   * @description
   * 모달이 열려있을 때 ESC 키를 누르면 모달이 닫히도록 합니다.
   * 사용자 경험을 향상시키기 위한 표준 모달 동작입니다.
   */
  useEffect(() => {
    if (!open) return; // 모달이 닫혀있으면 이벤트 리스너 등록 안 함

    const onKey = (e) => e.key === "Escape" && onClose?.();  // ESC 키 감지 → onClose 호출

    window.addEventListener("keydown", onKey);  // 이벤트 리스너 등록

    // Cleanup: 컴포넌트 언마운트 또는 open 상태 변경 시 이벤트 리스너 제거
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음 (early return)
  if (!open) return null;

  /**
   * stop - 이벤트 전파 중단 함수
   *
   * @description
   * 모달 내부 클릭 시 배경 클릭 이벤트로 전파되는 것을 방지합니다.
   * 이를 통해 모달 내부를 클릭해도 모달이 닫히지 않습니다.
   *
   * @param {Event} e - 이벤트 객체
   */
  const stop = (e) => e.stopPropagation();

  return (
    // 모달 배경 (오버레이)
    <div
      className="ep-backdrop"
      onClick={onClose}  // 배경 클릭 시 모달 닫기
      role="dialog"
      aria-modal="true"
      aria-labelledby="ep-title"
    >
      {/* 모달 컨텐츠 영역 (클릭 이벤트 전파 차단) */}
      <div className="ep-modal" onClick={stop}>
        {/* 닫기 버튼 (X) */}
        <button
          className="ep-close"
          aria-label="닫기"
          onClick={onClose}
        >
          ×
        </button>

        {/* 모달 제목 */}
        <h2 id="ep-title" className="ep-title">
          이메일 무단수집 거부
        </h2>

        {/* 금지 아이콘 (CSS로 스타일링) */}
        <div className="ep-icon" aria-hidden="true">
          <span className="ep-ban" />
        </div>

        {/* 정책 내용 */}
        <p className="ep-desc">
          본 사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여
          무단으로 수집되는 것을 거부하며, 이를 위반 시 「정보통신망법」에 의해 형사 처벌됨을 유념하시기 바랍니다.
        </p>

        {/* 게시일 */}
        <div className="ep-date">게시일 : 2025. 10. 27</div>

        {/* 확인 버튼 */}
        <div className="ep-actions">
          <button className="ep-btn" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}
