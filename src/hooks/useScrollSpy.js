import { useCallback } from 'react';

import useScrollValue from './useScrollValue.js';

/* 导航滚动高亮：取「视口上沿往下一小段」所命中的板块。
   ids 需要是稳定引用（模块级常量或 useMemo），别在渲染里现拼数组 */
export default function useScrollSpy(ids) {
  const compute = useCallback(() => {
    const header = document.querySelector('.site-header');
    const offset = (header ? header.offsetHeight : 0) + 40;

    let current = ids[0];

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top - offset <= 0) {
        current = id;
      }
    });

    // 已经滚到页面底部时，强制高亮最后一个板块
    // （最后一块高度不足一屏时，上面的判断可能选不中它）
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    return atBottom ? ids[ids.length - 1] : current;
  }, [ids]);

  return useScrollValue(compute, ids[0]);
}
