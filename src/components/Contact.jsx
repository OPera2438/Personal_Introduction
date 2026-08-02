import Section from './Section.jsx';

const CONTACTS = [
  {
    icon: 'fa-solid fa-envelope',
    label: '邮箱',
    value: '2438157551@qq.com',
    href: 'mailto:2438157551@qq.com',
  },
  {
    icon: 'fa-brands fa-github',
    label: 'GitHub',
    value: 'github.com/OPera2438',
    href: 'https://github.com/OPera2438',
    external: true,
  },
  {
    icon: 'fa-brands fa-weixin',
    label: '微信',
    value: 'LC18979082489',
  },
  {
    icon: 'fa-brands fa-qq',
    label: 'QQ',
    value: '2438157551',
  },
];

export default function Contact() {
  return (
    <Section
      id="contact"
      modifier="contact"
      eyebrow="04 — Contact"
      title="联系我"
      subtitle="欢迎联系"
    >
      <ul className="contact-list">
        {CONTACTS.map((item) => (
          <li className="card contact-item" key={item.label}>
            <span className="contact-item__icon">
              <i className={item.icon} aria-hidden="true"></i>
            </span>
            <span className="contact-item__label">{item.label}</span>

            {item.href ? (
              <a
                className="contact-item__value"
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener' : undefined}
              >
                {item.value}
              </a>
            ) : (
              <span className="contact-item__value contact-item__value--masked">{item.value}</span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
