import useInView from '../hooks/useInView.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

/* 板块外壳：统一的编号眉题 / 标题 / 副标题，外加滚动淡入。
   淡入只播一次，减少动效时完全不加 .reveal（否则元素会停在 opacity:0） */
export default function Section({ id, modifier, eyebrow, title, subtitle, children }) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.12, once: true });

  const className = [
    'section',
    modifier && `section--${modifier}`,
    !reduced && 'reveal',
    !reduced && inView && 'is-visible',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={className} id={id} ref={ref}>
      <div className="section__inner">
        <header className="section__header">
          <p className="section__eyebrow">{eyebrow}</p>
          <h2 className="section__title">{title}</h2>
          <p className="section__subtitle">{subtitle}</p>
        </header>

        {children}
      </div>
    </section>
  );
}
