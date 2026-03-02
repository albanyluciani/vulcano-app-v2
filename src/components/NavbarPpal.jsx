import '../styles/Navbarppal.css';

const vulcanoIcon = '/Icons/Vulcano_Icon-removebg-preview.png';

const NavbarPpal = () => {
  return (
    <nav className="vh-navbar">
      <div className="vh-nav-content">
        <div className="vh-logo">
          <img src={vulcanoIcon} alt="Vulcano Icon" className="vh-logo-icon" />
          VULCANO APP
        </div>
        <div className="vh-lang">IDIOMA DEL SITIO: ESPAÑOL ▾</div>
      </div>
    </nav>
  );
};

export default NavbarPpal;