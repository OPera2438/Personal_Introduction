import useScrollSpy from '../hooks/useScrollSpy.js';
import useScrollValue from '../hooks/useScrollValue.js';
import useTheme from '../hooks/useTheme.js';
import { useCallback } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于我' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'contact', label: '联系' },
];

// 模块级常量：引用稳定，不会每次渲染都让 useScrollSpy 重挂监听
const NAV_IDS = NAV_ITEMS.map((item) => item.id);

export default function Header() {
  const [theme, toggleTheme] = useTheme();
  const active = useScrollSpy(NAV_IDS);

  // 离开首屏后导航转为毛玻璃
  const isScrolled = useScrollValue(useCallback(() => window.scrollY > 40, []), false);

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`} id="siteHeader">
      <nav className="nav" aria-label="主导航">
        <a className="nav__logo" href="#home">刘畅</a>

        <ul className="nav__menu" id="navMenu">
          {NAV_ITEMS.map((item) => (
            <li className="nav__item" key={item.id}>
              <a
                className={`nav__link${active === item.id ? ' active' : ''}`}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 深色 / 浅色切换 */}
        <button
          className="theme-toggle"
          id="themeToggle"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          title="切换深色 / 浅色模式"
        >
          <span className="theme-toggle__track">
            <i className="fa-solid fa-sun theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true"></i>
            <i className="fa-solid fa-moon theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true"></i>
          </span>
        </button>
      </nav>
    </header>
  );
}
