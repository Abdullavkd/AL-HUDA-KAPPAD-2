export default function Logo() {
  return (
    <a
      href="/"
      aria-label="Ainul Huda Orphanage Kappad - Home"
      className="trust-logo"
    >
      <img
        src="/trust-logo.jpg"
        alt="Ainul Huda emblem"
        className="trust-logo__image"
      />
      <span className="trust-logo__text">
        <small>Al Huda Islamic Cultural Establishment and</small>
        <strong>Ainul Huda Orphanage</strong>
      </span>
    </a>
  );
}

