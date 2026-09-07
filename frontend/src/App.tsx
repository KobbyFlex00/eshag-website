const services = [
  { number: "01", title: "Strategy", text: "Clear direction for ambitious products, brands, and teams." },
  { number: "02", title: "Design", text: "Useful, expressive interfaces that make complex work feel simple." },
  { number: "03", title: "Technology", text: "Thoughtful digital systems built to grow with your organization." },
];

export default function App() {
  return (
    <main>
      <nav className="nav shell">
        <a className="wordmark" href="/">ESHAG<span>.</span></a>
        <a className="nav-link" href="mailto:hello@eshag.example">Start a conversation <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero shell">
        <p className="eyebrow">Independent digital studio · Est. 2024</p>
        <h1>Make the work<br /><em>matter.</em></h1>
        <div className="hero-bottom">
          <p className="intro">ESHAG helps organizations turn important ideas into clear, useful, and memorable digital experiences.</p>
          <a className="circle-link" href="#services" aria-label="Explore services">↓</a>
        </div>
      </section>

      <section className="services shell" id="services">
        <div className="section-heading"><p className="eyebrow">What we do</p><h2>Build with intent.</h2></div>
        <div className="service-list">
          {services.map((service) => <article className="service" key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><span className="arrow" aria-hidden="true">↗</span></article>)}
        </div>
      </section>

      <footer className="footer shell"><p>Have something meaningful in mind?</p><a href="mailto:hello@eshag.example">hello@eshag.example</a><small>© 2024 ESHAG Studio</small></footer>
    </main>
  );
}
