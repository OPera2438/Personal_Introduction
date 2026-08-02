import { useEffect, useState } from 'react';

import usePrefersReducedMotion from './usePrefersReducedMotion.js';

const TYPE_SPEED = 100;   // 每个字的间隔（毫秒）
const HOLD_TIME = 2000;   // 打完后的停顿
const RESTART_TIME = 400; // 清空后到下一轮的间隔

/* 打字机效果：逐字打出 → 停 2 秒 → 清空 → 循环重播。
   减少动效时直接返回完整文字，不做循环 */
export default function useTypewriter(text, active = true) {
  const reduced = usePrefersReducedMotion();

  // 初始值给全文：JS 还没跑起来时页面也是完整的，不会闪一下空白
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (reduced || !active) {
      setShown(text);
      return undefined;
    }

    // 用 Array.from 而不是 split('')，保证 emoji 等字符不会被拆坏
    const chars = Array.from(text);
    let index = 0;
    let timer;

    setShown('');

    function step() {
      if (index < chars.length) {
        index += 1;
        setShown(chars.slice(0, index).join(''));
        timer = setTimeout(step, TYPE_SPEED);
        return;
      }

      // 打完一轮：停顿 → 清空 → 重来
      timer = setTimeout(() => {
        setShown('');
        index = 0;
        timer = setTimeout(step, RESTART_TIME);
      }, HOLD_TIME);
    }

    timer = setTimeout(step, TYPE_SPEED);

    // 任何时刻只有一个待执行的定时器，清掉当前这个就够
    return () => clearTimeout(timer);
  }, [text, reduced, active]);

  return shown;
}
