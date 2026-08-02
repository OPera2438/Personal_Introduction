/* =============================================================
   个人介绍网站 —— 交互脚本
   0. 主题切换（深色 / 浅色 + localStorage）
   1. 打字机效果   2. 导航平滑滚动   3. 技能进度条动画
   4. 导航滚动高亮 5. 导航毛玻璃状态 6. 回到顶部悬浮按钮
   7. 项目截图预览弹层
   ============================================================= */

(function () {
  'use strict';

  // 是否开启了系统级「减少动效」
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var THEME_KEY = 'theme';

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initTypewriter();
    initSmoothScroll();
    initSkillBars();
    initScrollSpy();
    initHeaderState();
    initBackToTop();
    initLightbox();
    initMisc();
  });

  /* -----------------------------------------------------------
     0. 主题切换
     真正的初始赋值在 index.html <head> 的内联脚本里完成，
     这里只负责按钮交互、持久化，以及跟随系统偏好
     ----------------------------------------------------------- */
  function initTheme() {
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');

    function currentTheme() {
      return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function apply(theme) {
      root.setAttribute('data-theme', theme);
      if (btn) {
        btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
      }
    }

    apply(currentTheme());

    if (btn) {
      btn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        apply(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          /* 隐私模式下 localStorage 可能不可写，忽略即可 */
        }
      });
    }

    // 用户没手动选过时，跟随系统主题变化
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSchemeChange = function (e) {
      var saved = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch (err) { /* 同上 */ }
      if (!saved) {
        apply(e.matches ? 'dark' : 'light');
      }
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onSchemeChange);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(onSchemeChange);   // 旧版 Safari
    }
  }

  /* -----------------------------------------------------------
     1. 打字机效果
     文案取自 #typewriter 的 data-text 属性，逐字打出 →
     停 2 秒 → 清空 → 循环重播
     ----------------------------------------------------------- */
  function initTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;

    var text = el.dataset.text || el.textContent.trim();

    // 用 Array.from 而不是 split('')，保证 emoji 等字符不会被拆坏
    var chars = Array.from(text);

    var TYPE_SPEED = 100;   // 每个字的间隔（毫秒）
    var HOLD_TIME = 2000;   // 打完后的停顿
    var RESTART_TIME = 400; // 清空后到下一轮的间隔

    // 减少动效时直接显示完整文字，不做循环
    if (prefersReduced) {
      el.textContent = text;
      return;
    }

    var index = 0;
    el.textContent = '';

    function type() {
      if (index < chars.length) {
        el.textContent += chars[index];
        index += 1;
        setTimeout(type, TYPE_SPEED);
        return;
      }

      // 打完一轮：停顿 → 清空 → 重来
      setTimeout(function () {
        el.textContent = '';
        index = 0;
        setTimeout(type, RESTART_TIME);
      }, HOLD_TIME);
    }

    type();
  }

  /* -----------------------------------------------------------
     2. 导航平滑滚动
     CSS 里已设 html { scroll-padding-top }，
     scrollIntoView 会自动避开固定导航，无需手算偏移量
     ----------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var hash = link.getAttribute('href');
        if (!hash || hash === '#') return;

        var target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start'
        });

        // 同步地址栏，但不额外产生一条历史记录
        if (history.replaceState) {
          history.replaceState(null, '', hash);
        }
      });
    });
  }

  /* -----------------------------------------------------------
     3. 技能进度条动画
     HTML 内联 width 是无 JS 时的静态兜底值；
     这里先无过渡地压回 0%，滚动到技能区时再动画到 data-width
     ----------------------------------------------------------- */
  function initSkillBars() {
    var fills = document.querySelectorAll('.skill__fill');
    if (!fills.length) return;

    if (prefersReduced) {
      applyWidths(fills);
      return;
    }

    // 复位到 0%：临时关掉过渡，避免这一步本身产生动画
    fills.forEach(function (fill) {
      fill.style.transition = 'none';
      fill.style.width = '0%';
    });

    // 强制一次重排，让 width:0 真正生效后再恢复过渡
    void document.body.offsetHeight;

    fills.forEach(function (fill) {
      fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    var skillsSection = document.getElementById('skills');

    // 不支持 IntersectionObserver 时，直接播放
    if (!skillsSection || !('IntersectionObserver' in window)) {
      applyWidths(fills);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        applyWidths(fills);
        observer.unobserve(entry.target);   // 只播一次
      });
    }, { threshold: 0.25 });

    observer.observe(skillsSection);
  }

  function applyWidths(fills) {
    fills.forEach(function (fill) {
      var target = fill.dataset.width || '0';
      fill.style.width = parseFloat(target) + '%';
    });
  }

  /* -----------------------------------------------------------
     4. 导航滚动高亮
     取「视口上沿往下一小段」所命中的板块作为当前项
     ----------------------------------------------------------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
    if (!links.length) return;

    // 建立 链接 ↔ 板块 的对应关系
    var items = links
      .map(function (link) {
        var hash = link.getAttribute('href') || '';
        var section = hash.charAt(0) === '#' && hash.length > 1
          ? document.querySelector(hash)
          : null;
        return section ? { link: link, section: section } : null;
      })
      .filter(Boolean);

    if (!items.length) return;

    var header = document.querySelector('.site-header');
    var ticking = false;

    function setActive(activeLink) {
      items.forEach(function (item) {
        item.link.classList.toggle('active', item.link === activeLink);
      });
    }

    function update() {
      ticking = false;

      var offset = (header ? header.offsetHeight : 0) + 40;
      var current = items[0];

      items.forEach(function (item) {
        if (item.section.getBoundingClientRect().top - offset <= 0) {
          current = item;
        }
      });

      // 已经滚到页面底部时，强制高亮最后一个板块
      // （最后一块高度不足一屏时，上面的判断可能选不中它）
      var atBottom = window.innerHeight + window.scrollY >=
                     document.documentElement.scrollHeight - 2;
      if (atBottom) {
        current = items[items.length - 1];
      }

      setActive(current.link);
    }

    // 用 rAF 节流，避免滚动时高频触发布局读取
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  }

  /* -----------------------------------------------------------
     5. 导航毛玻璃状态
     顶部时透明（压在深色 Hero 上），下滚后加 .is-scrolled
     ----------------------------------------------------------- */
  function initHeaderState() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ticking = false;

    function update() {
      ticking = false;
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* -----------------------------------------------------------
     6. 回到顶部悬浮按钮
     滚过约 0.8 屏（大致是离开 Hero 之后）才出现在右下角
     ----------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    var ticking = false;

    function update() {
      ticking = false;
      // 阈值跟随视口高度，小窗口下不至于要滚很久才出现
      btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', update);

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });

      // 顺手清掉地址栏里残留的 #about 之类锚点
      if (history.replaceState) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    });

    update();
  }

  /* -----------------------------------------------------------
     7. 项目截图预览弹层
     点「查看详情」→ 从所在卡片里取截图、标题和完整简介
     （卡片上的简介被 CSS 截断了，这里拿到的仍是全文）
     ----------------------------------------------------------- */
  function initLightbox() {
    var box = document.getElementById('lightbox');
    var buttons = document.querySelectorAll('[data-project]');
    if (!box || !buttons.length) return;

    var imgEl = document.getElementById('lightboxImg');
    var titleEl = document.getElementById('lightboxTitle');
    var descEl = document.getElementById('lightboxDesc');
    var closeBtn = box.querySelector('.lightbox__close');

    var lastFocused = null;
    var closeTimer = null;

    function open(card) {
      var img = card.querySelector('.project-card__img');
      var title = card.querySelector('.project-card__title');
      var desc = card.querySelector('.project-card__desc');

      if (img) {
        imgEl.src = img.currentSrc || img.src;
        imgEl.alt = img.alt;
      }
      titleEl.textContent = title ? title.textContent.trim() : '';
      descEl.textContent = desc ? desc.textContent.trim() : '';

      lastFocused = document.activeElement;

      // 锁滚动前补上滚动条宽度，否则页面会横向抖一下
      var gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = gap > 0 ? gap + 'px' : '';
      document.body.classList.add('has-lightbox');

      clearTimeout(closeTimer);
      box.hidden = false;

      // 先渲染出隐藏态，下一帧再加类，过渡才有起点
      requestAnimationFrame(function () {
        box.classList.add('is-open');
      });

      if (closeBtn) closeBtn.focus();
    }

    function close() {
      if (box.hidden) return;

      box.classList.remove('is-open');
      document.body.classList.remove('has-lightbox');
      document.body.style.paddingRight = '';

      // 等淡出走完再真正移出无障碍树
      closeTimer = setTimeout(function () {
        box.hidden = true;
        imgEl.removeAttribute('src');
      }, prefersReduced ? 0 : 300);

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.project-card');
        if (card) open(card);
      });
    });

    // 背景和关闭按钮都带 data-lightbox-close
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-lightbox-close]')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;

      if (e.key === 'Escape') {
        close();
        return;
      }

      // 弹层里只有关闭按钮可聚焦，把 Tab 圈在里面
      if (e.key === 'Tab' && closeBtn) {
        e.preventDefault();
        closeBtn.focus();
      }
    });
  }

  /* -----------------------------------------------------------
     附加：页脚年份、区块滚动淡入
     ----------------------------------------------------------- */
  function initMisc() {
    // 页脚年份
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // 区块滚动淡入
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    var blocks = document.querySelectorAll('.section');
    blocks.forEach(function (el) {
      el.classList.add('reveal');
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    blocks.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

})();
