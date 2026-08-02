export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">
          &copy; <span id="year">{new Date().getFullYear()}</span> vibe coding
        </p>
        <ul className="site-footer__links">
          <li>
            <a
              href="https://github.com/OPera2438/Personal_Introduction"
              target="_blank"
              rel="noopener"
            >
              GitHub源码
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
