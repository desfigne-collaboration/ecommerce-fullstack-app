/**
 * ============================================================================
 * ErrorBoundary.jsx - React 에러 경계 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 하위 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착
 * - 앱 전체가 크래시되는 것을 방지하고 사용자 친화적인 폴백 UI 표시
 * - 개발 환경에서 상세한 에러 정보 제공
 *
 * 【React Error Boundary란?】
 * React 16부터 도입된 에러 처리 메커니즘입니다.
 * - Class 컴포넌트로만 구현 가능 (함수형 컴포넌트 불가)
 * - componentDidCatch, getDerivedStateFromError 라이프사이클 메서드 사용
 * - 하위 컴포넌트의 렌더링/라이프사이클/생성자 에러만 포착
 *
 * 【포착하지 못하는 에러】
 * - 이벤트 핸들러 내부 에러 (try-catch 사용 필요)
 * - 비동기 코드 (setTimeout, requestAnimationFrame 등)
 * - 서버 사이드 렌더링 에러
 * - ErrorBoundary 자체의 에러
 *
 * 【사용 위치】
 * - App.js에서 전체 앱을 감싸는 최상위 에러 처리
 * - 필요 시 특정 섹션을 감싸서 부분적인 에러 격리 가능
 *
 * 【사용 방법】
 * @example
 * // App.js에서 사용
 * <ErrorBoundary>
 *   <Header />
 *   <Routes>...</Routes>
 *   <Footer />
 * </ErrorBoundary>
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from 'react';

/**
 * ErrorBoundary 클래스 컴포넌트
 *
 * @class
 * @extends {React.Component}
 *
 * @property {Object} state - 컴포넌트 상태
 * @property {boolean} state.hasError - 에러 발생 여부
 * @property {Error|null} state.error - 발생한 에러 객체
 * @property {Object|null} state.errorInfo - 에러가 발생한 컴포넌트 스택 정보
 */
class ErrorBoundary extends React.Component {
  /**
   * 생성자: 초기 상태 설정
   *
   * @param {Object} props - 부모로부터 전달받은 props
   */
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,   // 에러 발생 여부
      error: null,       // 에러 객체
      errorInfo: null    // 에러 정보 (컴포넌트 스택)
    };
  }

  /**
   * getDerivedStateFromError (정적 메서드)
   *
   * @description
   * 하위 컴포넌트에서 에러가 발생하면 React가 자동으로 호출합니다.
   * 다음 렌더링에서 폴백 UI를 보여주기 위해 상태를 업데이트합니다.
   *
   * @static
   * @param {Error} error - 발생한 에러 객체
   * @returns {Object} 업데이트할 상태 객체
   *
   * @lifecycle
   * render phase에서 호출되므로 side-effect 금지
   */
  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI를 보여주도록 상태 업데이트
    return { hasError: true };
  }

  /**
   * componentDidCatch (라이프사이클 메서드)
   *
   * @description
   * 하위 컴포넌트에서 에러가 발생한 후 호출됩니다.
   * 에러 로깅, 에러 리포팅 서비스 전송 등의 side-effect 수행이 가능합니다.
   *
   * @param {Error} error - 발생한 에러 객체
   * @param {Object} errorInfo - 에러 정보 (errorInfo.componentStack에 컴포넌트 트리 정보 포함)
   *
   * @lifecycle
   * commit phase에서 호출되므로 side-effect 허용
   *
   * @example
   * // 프로덕션 환경에서 Sentry로 에러 전송
   * if (process.env.NODE_ENV === 'production') {
   *   Sentry.captureException(error, { extra: errorInfo })
   * }
   */
  componentDidCatch(error, errorInfo) {
    // 에러 로깅 (개발 환경)
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // 에러 정보 상태에 저장 (폴백 UI에서 표시용)
    this.setState({
      error,
      errorInfo
    });

    // 프로덕션에서는 에러 리포팅 서비스로 전송
    // 예: Sentry, LogRocket, Rollbar 등
    // if (process.env.NODE_ENV === 'production') {
    //   reportErrorToService(error, errorInfo)
    // }
  }

  /**
   * handleReset - 에러 상태 초기화 핸들러
   *
   * @description
   * 사용자가 "다시 시도" 버튼을 클릭하면 호출됩니다.
   * 에러 상태를 초기화하여 정상 UI로 복구를 시도합니다.
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * render - 렌더링 메서드
   *
   * @description
   * 에러 발생 여부에 따라 다른 UI를 렌더링합니다:
   * - hasError === true: 폴백 UI (에러 메시지 + 복구 버튼)
   * - hasError === false: 정상 자식 컴포넌트 렌더링
   *
   * @returns {JSX.Element} 렌더링할 UI
   */
  render() {
    // 에러가 발생한 경우: 폴백 UI 표시
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            {/* 에러 메시지 타이틀 */}
            <h1 style={styles.title}>앗! 문제가 발생했습니다</h1>
            <p style={styles.message}>
              일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>

            {/* 개발 환경에서만 상세 에러 정보 표시 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>에러 상세 정보 (개발 모드)</summary>
                <pre style={styles.errorText}>
                  <strong>Error:</strong> {this.state.error.toString()}
                  {'\n\n'}
                  <strong>Stack:</strong> {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* 복구 액션 버튼 */}
            <div style={styles.buttonGroup}>
              {/* 다시 시도: 에러 상태만 초기화 (같은 페이지에서 재렌더링) */}
              <button
                onClick={this.handleReset}
                style={styles.button}
              >
                다시 시도
              </button>
              {/* 홈으로 이동: 완전히 새로운 페이지로 이동 */}
              <button
                onClick={() => window.location.href = '/'}
                style={{...styles.button, ...styles.buttonSecondary}}
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 에러가 없는 경우: 정상적으로 자식 컴포넌트 렌더링
    return this.props.children;
  }
}

// ============================================================================
// 폴백 UI 스타일 (인라인 스타일 객체)
// ============================================================================
/**
 * styles 객체
 *
 * @description
 * ErrorBoundary 폴백 UI의 인라인 스타일을 정의합니다.
 * CSS 파일 대신 인라인 스타일을 사용하는 이유:
 * - ErrorBoundary는 CSS 로딩 실패 시에도 동작해야 함
 * - 의존성 없이 독립적으로 스타일이 적용되어야 함
 */
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  content: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px'
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
    lineHeight: '1.6'
  },
  details: {
    marginTop: '24px',
    marginBottom: '24px',
    textAlign: 'left',
    backgroundColor: '#f8f8f8',
    borderRadius: '4px',
    padding: '16px'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '12px'
  },
  errorText: {
    fontSize: '12px',
    color: '#d32f2f',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#000',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonSecondary: {
    backgroundColor: '#666'
  }
};

export default ErrorBoundary;
