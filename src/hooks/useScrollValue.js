import { useEffect, useState } from 'react';

/* 滚动派生值的通用底座：rAF 节流 + 监听 resize。
   compute() 返回什么就存什么，只有值真的变了才触发重渲染 ——
   所以适合布尔量、字符串这类离散值；每帧都变的连续值请用 useScrollStyle */
export default function useScrollValue(compute, initial = false) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      setValue(compute());
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
    // compute 由调用方用 useCallback 固定
  }, [compute]);

  return value;
}
