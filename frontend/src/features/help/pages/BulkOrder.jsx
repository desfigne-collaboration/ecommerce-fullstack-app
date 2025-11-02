/**
 * ============================================================================
 * BulkOrder.jsx - 단체주문 문의 페이지
 * ============================================================================
 *
 * 【목적】
 * - 기업/단체 고객의 대량 주문 문의 접수
 * - 문의자 정보 및 주문 요구사항 수집
 * - 개인정보 수집 동의 및 알림 수신 설정
 *
 * 【주요 기능】
 * 1. **문의 폼**: 문의자명, 업체명, 연락처, 이메일 등 필수 정보 수집
 * 2. **주문 상세**: 요청브랜드, 상품번호, 구매희망수량, 필요일자 입력
 * 3. **필수 항목 검증**: 문의자명/업체명/연락처/이메일 필수 체크
 * 4. **개인정보 동의**: 필수 동의 체크박스 (미동의 시 제출 불가)
 * 5. **답변 알림**: 선택적 SMS/알림톡 수신 동의
 * 6. **localStorage 저장**: createBulkOrder API로 문의 데이터 저장
 *
 * 【데이터 구조】
 * - form 상태:
 *   - inquirerName: 문의자명 (필수)
 *   - companyName: 업체명 (필수)
 *   - phone: 연락처 (필수)
 *   - email: 이메일 (필수)
 *   - requestBrand: 요청브랜드 (선택)
 *   - productNo: 상품번호 (선택)
 *   - quantity: 구매희망수량 (선택)
 *   - needDate: 필요일자 (선택)
 *   - message: 문의내용 (선택)
 *   - agree: 개인정보 동의 (필수)
 *   - replyNotify: 답변알림 수신 (선택)
 *
 * 【검증 규칙】
 * - 필수 항목 누락 시 alert로 안내
 * - 개인정보 동의 미체크 시 제출 불가
 * - 제출 성공 시 접수번호 표시 및 폼 초기화
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useState } from "react";
import { createBulkOrder } from "../../order/api/orders";
import "./BulkOrder.css";

/**
 * BulkOrder - 단체주문 문의 페이지 컴포넌트
 *
 * @description
 * 기업 및 단체 고객이 대량 주문 문의를 남길 수 있는 폼 페이지입니다.
 *
 * 【처리 흐름】
 * 1. 사용자가 폼 입력
 * 2. 제출 버튼 클릭 시 onSubmit 핸들러 실행
 * 3. 필수 항목 검증 (문의자명/업체명/연락처/이메일/개인정보 동의)
 * 4. createBulkOrder API 호출로 localStorage에 저장
 * 5. 성공 시 접수번호 alert 표시 및 폼 초기화
 * 6. 실패 시 오류 메시지 표시
 *
 * 【스타일링】
 * - bulk-grid: 라벨(좌측) + 입력(우측) 2열 그리드 레이아웃
 * - bulk-label.required: 빨간 별표(*) 표시
 * - bulk-privacy-box: 스크롤 가능한 개인정보 동의 박스
 *
 * 【연동 API】
 * - createBulkOrder(form): localStorage에 bulkOrders 배열로 저장
 *   - 새 ID 생성 (타임스탬프 기반)
 *   - 문의 접수 시간(createdAt) 자동 추가
 *   - 접수 ID 반환
 *
 * @returns {JSX.Element} 단체주문 문의 폼 페이지
 *
 * @example
 * // App.jsx 또는 라우터에서 사용:
 * <Route path="/bulk-order" element={<BulkOrder />} />
 */
export default function BulkOrder() {
  const [form, setForm] = useState({
    inquirerName: "",      // 문의자명
    companyName: "",       // 업체명
    phone: "",             // 연락처
    email: "",             // 이메일
    requestBrand: "",      // 요청브랜드
    productNo: "",         // 상품번호
    quantity: "",          // 구매희망수량
    needDate: "",          // 필요일자
    message: "",           // 문의내용
    agree: false,          // 개인정보 동의
    replyNotify: false,    // 답변등록 알림톡/SMS 수신
  });

  /**
   * onChange - 폼 입력 핸들러
   *
   * @description
   * 텍스트 입력 및 체크박스 변경 시 form 상태를 업데이트합니다.
   *
   * @param {Event} e - 입력 이벤트
   * - e.target.name: 입력 필드명
   * - e.target.value: 입력 값
   * - e.target.type: 입력 타입 (checkbox/text/email 등)
   * - e.target.checked: 체크박스 체크 여부
   */
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  /**
   * onSubmit - 문의 제출 핸들러
   *
   * @description
   * 폼 제출 시 필수 항목 검증 후 createBulkOrder API를 호출하여 저장합니다.
   *
   * 【검증 단계】
   * 1. 문의자명/업체명/연락처/이메일 필수 체크
   * 2. 개인정보 동의 체크 확인
   * 3. createBulkOrder 호출로 localStorage 저장
   * 4. 성공 시 접수번호 표시 및 폼 초기화
   * 5. 실패 시 오류 메시지 표시
   *
   * @param {Event} e - 폼 제출 이벤트
   *
   * @example
   * // 폼 제출 성공 시:
   * // alert("단체주문 문의가 접수되었습니다.\n접수번호: 1730556789123")
   * // 폼 초기화되어 빈 입력 상태로 리셋
   */
  const onSubmit = (e) => {
    e.preventDefault();

    // 필수값 간단검증
    if (!form.inquirerName || !form.companyName || !form.phone || !form.email) {
      alert("문의자명/업체명/연락처/이메일은 필수입니다.");
      return;
    }
    if (!form.agree) {
      alert("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    const id = createBulkOrder(form);
    if (id) {
      alert(`단체주문 문의가 접수되었습니다.\n접수번호: ${id}`);
      // 원하면 관리자 페이지로 바로 이동:
      // window.location.href = "/#/admin/orders";
      // 또는 현재 폼 초기화
      setForm({
        inquirerName: "",
        companyName: "",
        phone: "",
        email: "",
        requestBrand: "",
        productNo: "",
        quantity: "",
        needDate: "",
        message: "",
        agree: false,
        replyNotify: false,
      });
    } else {
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="bulk-wrap">
      <div className="bulk-header">
        <h1>단체주문</h1>
      </div>

      <form className="bulk-form" onSubmit={onSubmit}>
        <div className="bulk-grid">
          {/* 좌측 라벨 · 우측 입력 */}
          <label className="bulk-label required">문의자명</label>
          <input
            className="bulk-input"
            name="inquirerName"
            value={form.inquirerName}
            onChange={onChange}
            placeholder="성함을 입력하세요"
          />

          <label className="bulk-label required">업체명</label>
          <input
            className="bulk-input"
            name="companyName"
            value={form.companyName}
            onChange={onChange}
            placeholder="업체/기관명을 입력하세요"
          />

          <label className="bulk-label required">연락처</label>
          <input
            className="bulk-input"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="예) 010-1234-5678"
          />

          <label className="bulk-label required">이메일</label>
          <input
            className="bulk-input"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="예) hello@example.com"
          />

          <label className="bulk-label">요청브랜드</label>
          <input
            className="bulk-input"
            name="requestBrand"
            value={form.requestBrand}
            onChange={onChange}
            placeholder="브랜드명을 입력하세요"
          />

          <label className="bulk-label">상품번호</label>
          <input
            className="bulk-input"
            name="productNo"
            value={form.productNo}
            onChange={onChange}
            placeholder="상품번호가 있을 경우 입력"
          />

          <label className="bulk-label">구매희망수량</label>
          <input
            className="bulk-input"
            name="quantity"
            value={form.quantity}
            onChange={onChange}
            placeholder="예) 100"
          />

          <label className="bulk-label">필요일자</label>
          <input
            className="bulk-input"
            name="needDate"
            value={form.needDate}
            onChange={onChange}
            placeholder="예) 2025-11-30"
          />

          <label className="bulk-label">문의내용</label>
          <textarea
            className="bulk-textarea"
            name="message"
            value={form.message}
            onChange={onChange}
            placeholder={
              "단체 주문 문의 시 아래 필수 항목을 꼭 작성해주세요.\n\n담당자명:\n연락처(핸드폰번호 필수):\n이메일:\n요청 브랜드:\n품번:\n\n특수문자 W/: < > 는 사용할 수 없습니다."
            }
          />

          {/* 체크박스 영역 */}
          <div className="bulk-label"></div>
          <label className="bulk-checkbox">
            <input
              type="checkbox"
              name="replyNotify"
              checked={form.replyNotify}
              onChange={onChange}
            />
            &nbsp;답변등록여부 알림톡, SMS수신
          </label>
        </div>

        {/* 개인정보 수집·이용 동의 */}
        <div className="bulk-privacy">
          <div className="bulk-privacy-head">
            <label className="bulk-checkbox">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
              />
              &nbsp;개인정보 수집 이용에 대한 동의 (필수)
            </label>
          </div>
          <div className="bulk-privacy-box">
            <p>
              회사는 단체주문 문의를 처리하기 위해 아래와 같이 개인정보를 수집 및 이용합니다. 내용을 자세히
              읽으신 후 동의 여부를 결정하여 주십시오.
            </p>
            <ul>
              <li>수집/이용 목적: 단체주문 문의의 처리 및 응대</li>
              <li>수집/이용 항목: 이름, 연락처, 이메일</li>
              <li>보유 및 이용기간: 3년 보관 후 파기</li>
            </ul>
            <p>동의를 거부할 권리가 있으며, 거부 시 문의 작성이 제한됩니다.</p>
          </div>
        </div>

        <div className="bulk-actions">
          <button
            type="button"
            className="bulk-btn ghost"
            onClick={() => window.history.back()}
          >
            취소
          </button>
          <button type="submit" className="bulk-btn primary">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
