import Section from './Section.jsx';
import skills from '../data/skills.js';
import useInView from '../hooks/useInView.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

export default function Skills() {
  const reduced = usePrefersReducedMotion();
  // 整块技能区进入视口才开始动画，六条一起走
  const [ref, inView] = useInView({ threshold: 0.25, once: true });

  const filled = reduced || inView;

  return (
    <Section
      id="skills"
      modifier="skills"
      eyebrow="02 — Skills"
      title="技能"
      subtitle="百分比只是个大概的自我评估，仅供参考"
    >
      <ul className="card skills__grid" ref={ref}>
        {skills.map((skill) => (
          <li className="skill" key={skill.name}>
            <div className="skill__head">
              <span className="skill__name">{skill.name}</span>
              <span className="skill__pct">{skill.pct}%</span>
            </div>

            <div
              className="skill__bar"
              role="progressbar"
              aria-label={`${skill.name} 熟练度`}
              aria-valuenow={skill.pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* 宽度从 0 动画到目标值，过渡写在 CSS 的 .skill__fill 里；
                  减少动效时直接就位，顺手把过渡关掉 */}
              <span
                className="skill__fill"
                style={{
                  width: filled ? `${skill.pct}%` : '0%',
                  transition: reduced ? 'none' : undefined,
                }}
              ></span>
            </div>

            <p className="skill__note">{skill.note}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
