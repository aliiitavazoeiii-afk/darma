const products = [
  { name: "مدل روزمره دارما", price: "قیمت به‌زودی" },
  { name: "مدل مینیمال دارما", price: "قیمت به‌زودی" },
  { name: "مدل راحتی دارما", price: "قیمت به‌زودی" },
  { name: "پک دارما", price: "قیمت به‌زودی" },
];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#">DARMA</a>
        <nav className="nav" aria-label="منوی اصلی">
          <a href="#shop">فروشگاه</a>
          <a href="#new">جدیدها</a>
          <a href="#about">درباره دارما</a>
        </nav>
        <a href="#shop" aria-label="سبد خرید">سبد خرید</a>
      </header>

      <section className="hero" aria-label="مجموعه جدید دارما">
        <div className="heroContent">
          <h1>DARMA</h1>
          <p>سادگی در طراحی. راحتی در استفاده. خرید بدون شلوغی.</p>
          <a className="cta" href="#shop">مشاهده محصولات</a>
        </div>
      </section>

      <section className="section" id="shop">
        <div className="sectionHead">
          <h2>منتخب دارما</h2>
          <a href="#">مشاهده همه</a>
        </div>
        <div className="products">
          {products.map((product) => (
            <article key={product.name}>
              <div className="cardVisual" aria-hidden="true" />
              <div className="cardMeta">
                <span>{product.name}</span>
                <span>{product.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial" id="about">
        <div>
          <h3>کمتر، بهتر.</h3>
          <p>این بخش در نسخه نهایی با تصویر یا ویدئوی واقعی برند جایگزین می‌شود و داستان محصول را بدون شلوغ کردن تجربه خرید روایت می‌کند.</p>
        </div>
      </section>

      <footer className="footer">
        <strong>DARMA</strong>
        <span>فروشگاه آنلاین دارما</span>
        <span>darma.biya2film.top</span>
      </footer>
    </main>
  );
}
