import { useNavigate } from 'react-router-dom';
import '../styles/VulcanoMain.css';

const logoVideo = '/videos/Logo.mp4';

const VulcanoMain = () => {
  const navigate = useNavigate()
  return (
    <main className="vh-hero">
      <div className="vh-hero-content">
        <div className="vh-lava-circle">
          <video className="vh-mascot" autoPlay loop muted playsInline>
            <source src={logoVideo} type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
        </div>
        <div className="vh-text-side">
          <h1 className="vh-title">
            ¡La forma divertida y eficaz de aprender sobre programación!
          </h1>
          <div className="vh-button-group">
            <button onClick={()=>navigate("/register")} className="vh-btn-primary">REGISTRATE</button>
            <button onClick={()=>navigate("/login")} className="vh-btn-secondary">YA TENGO UNA CUENTA</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default VulcanoMain;