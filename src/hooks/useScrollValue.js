import { useEffect, useState } from 'react';

/* 全站共享一个 scroll / resize 监听和一个 rAF。
   Header、回到顶部、首页箭头等订阅者都在同一帧更新，避免每个组件
   各自注册监听和 requestAnimationFrame，降低 Chromium / Edge 的滚动开销。 */
const subscribers = new Set();
let frame = 0;
let listening = false;

function flush() {
  frame = 0;
  subscribers.forEach((callback) => callback());
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

function stopListening() {
  if (!listening || subscribers.size > 0) return;
  listening = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

export function subscribeViewportFrame(callback) {
  subscribers.add(callback);
  startListening();

  return () => {
    subscribers.delete(callback);
    stopListening();
  };
}

/* 滚动派生值的通用底座。
   compute() 返回什么就存什么，值未变化时不触发组件重渲染；
   适合布尔量、字符串等离散值。连续视觉值应直接写元素 style。 */
export default function useScrollValue(compute, initial = false) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    function update() {
      const next = compute();
      setValue((current) => (Object.is(current, next) ? current : next));
    }

    update();
    return subscribeViewportFrame(update);
    // compute 由调用方用 useCallback 固定
  }, [compute]);

  return value;
}
