import { useCallback, useEffect, useRef, useState } from 'react';

import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

// 与 style.css 第 1 节的 --dur 保持一致，改那边记得同步改这里
const EXIT_DURATION = 300;

/* 项目截图预览弹层。
   item 为 null 表示关闭，但内容不能立刻消失 —— 否则淡出动画没东西可播，
   所以内部另存一份 rendered，撑到过渡结束再卸载 */
export default function Lightbox({ item, onClose }) {
  const reduced = usePrefersReducedMotion();

  const [rendered, setRendered] = useState(null); // 退场期间保留的内容
  const [active, setActive] = useState(false);    // 控制 .is-open

  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  // 进场：先记住焦点来源，再把内容挂上去
  useEffect(() => {
    if (!item) return;
    lastFocused.current = document.activeElement;
    setRendered(item);
  }, [item]);

  // 内容渲染完是隐藏态，下一帧再加 .is-open，过渡才有起点
  useEffect(() => {
    if (!item || !rendered) return undefined;
    const frame = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(frame);
  }, [item, rendered]);

  // 退场：先撤 .is-open 播淡出，走完再真正卸载
  useEffect(() => {
    if (item || !rendered) return undefined;
    setActive(false);
    const timer = setTimeout(() => setRendered(null), reduced ? 0 : EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [item, rendered, reduced]);

  // 锁滚动。挂在 item 上而不是 rendered 上：关闭的瞬间就该解锁，
  // 拖到淡出结束才解会让滚动条晚回来 300ms
  useEffect(() => {
    if (!item) return undefined;

    // 锁之前补上滚动条宽度，否则页面会横向抖一下
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    document.body.classList.add('has-lightbox');

    return () => {
      document.body.classList.remove('has-lightbox');
      document.body.style.paddingRight = '';
    };
  }, [item]);

  // 焦点：打开时移到关闭按钮，卸载时还给原来的元素
  useEffect(() => {
    if (!rendered) return undefined;
    if (closeRef.current) closeRef.current.focus();

    return () => {
      const prev = lastFocused.current;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, [rendered]);

  useEffect(() => {
    if (!item) return undefined;

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // 弹层里只有关闭按钮可聚焦，把 Tab 圈在里面
      if (e.key === 'Tab' && closeRef.current) {
        e.preventDefault();
        closeRef.current.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  // 背景和关闭按钮都带 data-lightbox-close
  const handleClick = useCallback(
    (e) => {
      if (e.target.closest('[data-lightbox-close]')) onClose();
    },
    [onClose]
  );

  if (!rendered) return null;

  return (
    <div
      className={`lightbox${active ? ' is-open' : ''}`}
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightboxTitle"
      onClick={handleClick}
    >
      <div className="lightbox__backdrop" data-lightbox-close></div>

      <div className="lightbox__panel">
        <button
          className="lightbox__close"
          type="button"
          aria-label="关闭预览"
          data-lightbox-close
          ref={closeRef}
        >
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>

        <img
          className="lightbox__img"
          id="lightboxImg"
          src={rendered.image}
          alt={rendered.alt}
          width={rendered.width}
          height={rendered.height}
          decoding="async"
        />

        <div className="lightbox__meta">
          <h3 className="lightbox__title" id="lightboxTitle">{rendered.title}</h3>
          <p className="lightbox__desc" id="lightboxDesc">{rendered.desc}</p>
        </div>
      </div>
    </div>
  );
}
