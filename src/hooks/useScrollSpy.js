import { useEffect, useState } from 'react';

/* 导航滚动高亮。
   旧实现会在每个滚动帧读取 5 次 getBoundingClientRect，容易触发同步布局；
   现在用 IntersectionObserver 让浏览器异步汇报可见区块，只在交叉状态变化时更新。 */
export default function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return undefined;

    if (!('IntersectionObserver' in window)) {
      setActive(ids[0]);
      return undefined;
    }

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        });

        if (visible.size === 0) return;

        // 视口上半区里可见面积最大的板块作为当前项；相同时取页面中靠后的板块。
        const next = ids.reduce((best, id) => {
          const ratio = visible.get(id) || 0;
          const bestRatio = visible.get(best) || 0;
          return ratio >= bestRatio ? id : best;
        }, ids[0]);

        setActive((current) => (current === next ? current : next));
      },
      {
        // 保留视口中部 50% 作为判定带，确保小屏和矮窗口下仍有有效观察区域。
        rootMargin: '-15% 0px -35% 0px',
        threshold: [0, 0.15, 0.35, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
