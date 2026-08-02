import Section from './Section.jsx';

const STATS = [
  { num: '三个月', label: '实习经验' },
  { num: '2', label: '交付项目' },
  { num: '2', label: '独立项目' },
];

export default function About() {
  return (
    <Section
      id="about"
      modifier="about"
      eyebrow="01 — About"
      title="关于我"
      subtitle="一点背景，和一些代码之外的事"
    >
      <div className="card about__card">
        <div className="about__text">
          <p>
            我是2026届电子信息工程本科毕业生，在校期间系统学习了软硬件知识，并通过项目实践将理论转化为应用。我独立开发了校园运动会报名与成绩管理系统，涵盖后端架构、数据库设计及前端响应式交互，积累了完整的全栈项目经验。
          </p>

          <p>
            在远大科技集团的AI应用开发实习中，我深入参与企业级AI聊天助手的优化，以及碳排放数据的实时集成与可视化展示，熟悉大模型API调用、Prompt工程和前端图表开发。我熟练掌握Python、MySQL、Vue等技术栈，习惯用Git进行规范协作，同时具备快速学习能力和团队合作精神。职业方向聚焦于AI应用开发，期待在技术落地中持续创造价值。
          </p>
        </div>

        <div className="about__side">
          <ul className="about__stats">
            {STATS.map((stat) => (
              <li className="stat" key={stat.label}>
                <span className="stat__num">{stat.num}</span>
                <span className="stat__label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
