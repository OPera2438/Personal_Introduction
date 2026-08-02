import { useEffect, useRef } from 'react';

/* 元素随滚动连续淡出（首页那个向下箭头）。
   这里刻意绕过 state 直接写 style：透明度每帧都在变，
   走 setState 会让整棵树每帧重渲染；而且 CSS transition 里也不能加 opacity，
   否则它会滞后于滚动位置，看着像在拖影。

   ratio：滚过「视口高度 × ratio」时刚好完全透明 */
export default function useFadeOnScroll(ratio = 0.45) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let ticking = false;

    function update() {
      ticking = false;

      let opacity = 1 - window.scrollY / (window.innerHeight * ratio);
      opacity = Math.max(0, Math.min(1, opacity));

      el.style.opacity = opacity.toFixed(3);
      // 淡到看不见后别再挡点击（它此时多半已经滚出视口）
      el.style.pointerEvents = opacity < 0.05 ? 'none' : '';
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [ratio]);

  return ref;
}
