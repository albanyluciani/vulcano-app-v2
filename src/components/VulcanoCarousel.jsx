import "../styles/VulcanoCarousel.css";
const Carousel = () => {
  return (
    <section className="carrusel-container">
      <div className="carrusel">
        <div className="item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/226/226777.png"
            alt="Java"
          />
          <span>JAVA</span>
        </div>
        <div className="item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
            alt="JavaScript"
          />
          <span>JAVASCRIPT</span>
        </div>

        <div className="item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/732/732190.png"
            alt="CSS"
          />
          <span>CSS</span>
        </div>

        <div className="item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/732/732212.png"
            alt="HTML"
          />
          <span>HTML</span>
        </div>

        <div className="item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4248/4248443.png"
            alt="SQL"
          />
          <span>SQL</span>
        </div>
      </div>
    </section>
  );
}

export default Carousel;