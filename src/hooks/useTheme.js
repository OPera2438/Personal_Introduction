import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'theme';

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null; // 隐私模式下 localStorage 可能不可读
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    /* 同上，忽略即可 */
  }
}

/* 深色 / 浅色主题。
   初始值由 index.html <head> 里的内联脚本写进 data-theme，
   这里只接手后续的切换、持久化和跟随系统 */
export default function useTheme() {
  const [theme, setTheme] = useState(
    () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      write(THEME_KEY, next);
      return next;
    });
  }, []);

  // 用户没手动选过时，跟随系统主题变化
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const onChange = (e) => {
      if (!read(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }

    mq.addListener(onChange); // 旧版 Safari
    return () => mq.removeListener(onChange);
  }, []);

  return [theme, toggle];
}
