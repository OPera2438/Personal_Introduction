import { useCallback } from 'react';

import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import useScrollValue from '../hooks/useScrollValue.js';

/* 回到顶部悬浮按钮：滚过约 0.8 屏（大致是离开 Hero 之后）才出现在右下角。
   阈值跟随视口高度，小窗口下不至于要滚很久才出现 */
export default function BackToTop() {
  const reduced = usePrefersReducedMotion();

  const isVisible = useScrollValue(
    useCallback(() => window.scrollY > window.innerHeight * 0.8, []),
    false
  );

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });

    // 顺手清掉地址栏里残留的 #about 之类锚点
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, [reduced]);

  return (
    <button
      className={`back-to-top${isVisible ? ' is-visible' : ''}`}
      id="backToTop"
      type="button"
      onClick={handleClick}
      aria-label="回到顶部"
      title="回到顶部"
    >
      <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
    </button>
  );
}
