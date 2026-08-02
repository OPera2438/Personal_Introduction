import Section from './Section.jsx';
import skills from '../data/skills.js';
import useInView from '../hooks/useInView.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

export default function Skills() {
  const reduced = usePrefersReducedMotion();
  /* 整块技能区进入视口就播一次动画，六条一起走；完全滚出视口后复位，
     下次再滚回来重新播。once: false 时 useInView 用 isIntersecting 判定，
     只有整块彻底离开视口才会转 false —— 所以不会出现「还看得见就已经掉回 0」*/
  const [ref, inView] = useInView({ threshold: 0.25, once: false });

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
              {/* 用 transform 而不是 width 播放进度，避免动画每帧触发布局计算。
                  复位（filled 为 false）时关掉过渡：这一步发生在视口外，用户看不到，
                  但能保证下次滚回来一定是从 0 开始播完整的一遍。 */}
              <span
                className="skill__fill"
                style={{
                  '--skill-progress': filled ? skill.pct / 100 : 0,
                  transition: reduced || !filled ? 'none' : undefined,
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
