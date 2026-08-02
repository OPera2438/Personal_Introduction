import { useEffect, useState } from 'react';

import useFadeOnScroll from '../hooks/useFadeOnScroll.js';
import useTypewriter from '../hooks/useTypewriter.js';

const SUBTITLE = 'Currently designing products for humans.';

export default function Hero() {
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState !== 'hidden');
  const typed = useTypewriter(SUBTITLE, pageVisible);
  const scrollHintRef = useFadeOnScroll(0.45);

  // 标签页切到后台时暂停循环定时器，减少 Edge 的后台唤醒与恢复瞬间卡顿。
  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return (
    <section className="hero" id="home">
      {/* 装饰层：网格 + 光晕，纯 CSS 绘制 */}
      <div className="hero__decor" aria-hidden="true">
        <span className="hero__grid"></span>
        <span className="hero__glow hero__glow--a"></span>
        <span className="hero__glow hero__glow--b"></span>
      </div>

      <div className="hero__inner">
        <p className="hero__hello">Hello, I am</p>

        <h1 className="hero__display">LIU&nbsp;CHANG</h1>

        {/* 打字机效果只作用于副标题 */}
        <p className="hero__subtitle">
          <span id="typewriter">{typed}</span>
          <span className="hero__cursor" aria-hidden="true"></span>
        </p>

        <div className="hero__actions">
          <a className="btn btn--ghost" href="#contact">联系方式</a>
          <a className="btn btn--ghost" href="#projects">我的项目</a>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="向下滚动" ref={scrollHintRef}>
        <i className="fa-solid fa-arrow-down" aria-hidden="true"></i>
      </a>
    </section>
  );
}
