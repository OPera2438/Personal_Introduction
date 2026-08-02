import { useEffect, useRef } from 'react';

import { subscribeViewportFrame } from './useScrollValue.js';

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

    let lastOpacity = -1;
    let pointerDisabled = false;

    function update() {
      let opacity = 1 - window.scrollY / (window.innerHeight * ratio);
      opacity = Math.max(0, Math.min(1, opacity));

      // 到达全显或全隐后不再重复写 style，减少 Edge 的样式失效与合成工作。
      const rounded = Math.round(opacity * 100) / 100;
      if (rounded !== lastOpacity) {
        el.style.opacity = String(rounded);
        lastOpacity = rounded;
      }

      const shouldDisablePointer = opacity < 0.05;
      if (shouldDisablePointer !== pointerDisabled) {
        el.style.pointerEvents = shouldDisablePointer ? 'none' : '';
        pointerDisabled = shouldDisablePointer;
      }
    }

    update();
    return subscribeViewportFrame(update);
  }, [ratio]);

  return ref;
}
