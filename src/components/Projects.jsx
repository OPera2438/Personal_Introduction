import Section from './Section.jsx';
import projects from '../data/projects.js';

export default function Projects({ onPreview }) {
  return (
    <Section
      id="projects"
      modifier="projects"
      eyebrow="03 — Work"
      title="项目经历"
      subtitle="挑了三个比较有代表性的"
    >
      {/* 截图 / 标题 / 简介 / 标签 / 按钮五行由 CSS subgrid 逐行对齐，
          文案长短不一也不会错位，详见 style.css 第 11 节 */}
      <div className="projects__grid">
        {projects.map((project) => (
          <article className="card project-card" key={project.id}>
            <div className="project-card__media">
              <img
                className="project-card__img"
                src={project.image}
                alt={project.alt}
                width={project.width}
                height={project.height}
                loading="lazy"
              />
            </div>

            <div className="project-card__body">
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{project.desc}</p>
              <ul className="project-card__tags">
                {project.tags.map((tag) => (
                  <li className="tag" key={tag}>{tag}</li>
                ))}
              </ul>
            </div>

            <footer className="project-card__footer">
              <button
                className="btn btn--soft btn--sm"
                type="button"
                onClick={() => onPreview(project)}
              >
                查看详情 <i className="fa-solid fa-arrow-right btn__arrow" aria-hidden="true"></i>
              </button>
            </footer>
          </article>
        ))}
      </div>
    </Section>
  );
}
