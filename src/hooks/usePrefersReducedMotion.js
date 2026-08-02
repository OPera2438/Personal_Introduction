import { useSyncExternalStore } from 'react';

/* 系统级「减少动效」偏好。
   用 useSyncExternalStore 订阅，用户在系统设置里改了能立刻生效 */

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback) {
  const mq = window.matchMedia(QUERY);

  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  }

  mq.addListener(callback); // 旧版 Safari
  return () => mq.removeListener(callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

export default function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
