import { useCallback, useState } from 'react';

import About from './components/About.jsx';
import BackToTop from './components/BackToTop.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Lightbox from './components/Lightbox.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import useHashScroll from './hooks/useHashScroll.js';

export default function App() {
  // 当前预览的项目，null 表示弹层关闭
  const [preview, setPreview] = useState(null);
  const closePreview = useCallback(() => setPreview(null), []);

  useHashScroll();

  return (
    <>
      <a className="skip-link" href="#main">跳到主要内容</a>

      <Header />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects onPreview={setPreview} />
        <Contact />
      </main>

      <Footer />

      <Lightbox item={preview} onClose={closePreview} />
      <BackToTop />
    </>
  );
}
