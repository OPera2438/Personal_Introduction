import { useEffect, useRef, useState } from 'react';

/* 元素进入视口时返回 true。
   once 为 true 时只触发一次，之后停止观察（滚动淡入、进度条都只播一次）。
   不支持 IntersectionObserver 的浏览器直接返回 true，退化成「无动画但内容可见」 */
export default function useInView({ threshold = 0.12, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
