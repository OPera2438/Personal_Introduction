import { useEffect } from 'react';

import usePrefersReducedMotion from './usePrefersReducedMotion.js';

/* 锚点平滑滚动。
   CSS 里已设 html { scroll-padding-top }，scrollIntoView 会自动避开固定导航，
   不用手算偏移量。用事件委托挂在 document 上，组件怎么增删都不用改这里 */
export default function useHashScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    function onClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });

      // 同步地址栏，但不额外产生一条历史记录。
      // file:// 或受限环境可能禁止 History API，不影响滚动本身。
      try {
        window.history.replaceState(null, '', hash);
      } catch (error) {
        // 无需处理：地址栏不更新也不影响页面功能。
      }
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [reduced]);
}
