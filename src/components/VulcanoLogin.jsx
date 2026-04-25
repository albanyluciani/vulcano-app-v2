// ============================================================
// VulcanoLogin.jsx
// ------------------------------------------------------------
// Este componente es el formulario de inicio de sesión.
// Cuando el usuario hace clic en "Ingresar":
//   1. Tomamos el username y password de los inputs
//   2. Llamamos a loginUser() que habla con el backend
//   3. Si el backend dice OK → redirigimos a /layout
//   4. Si hay error → mostramos un mensaje en pantalla
// ============================================================
import "../styles/VulcanoLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../services/api"; // función que llama a POST /api/auth/login
import Swal from "sweetalert2";

const VulcanoLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");    // mensaje de error
  const [loading, setLoading]   = useState(false); // indicador de carga

  // ----------------------------------------------------------
  // sigIn: se ejecuta cuando el usuario hace clic en "Ingresar"
  // Envía username y password al backend (POST /api/auth/login)
  // Si la respuesta es 200 → guarda la sesión y redirige
  // Si la respuesta es 401 → muestra el error del backend
  // ----------------------------------------------------------
  async function sigIn(e) {
    e.preventDefault();
    setError("");      // limpiamos error anterior
    setLoading(true);

    try {
      // loginUser ahora devuelve el objeto User COMPLETO con su perfil:
      // { id, username, password, profile: { firstName, lastName, email, profilePictureUrl, ... } }
      const userData = await loginUser(username, password);

      // Guardamos el objeto completo en localStorage.
      // Así el Layout puede leer firstName, profilePictureUrl, id, etc.
      // sin necesidad de hacer otra petición al backend.
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirigimos al Layout
      navigate("/layout");
    } catch (err) {
      // El mensaje de error viene directo del backend
      Swal.fire({
        title: "Error de acceso",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#472825",
        background: "#fff4e2",
        color: "#472825"
      });
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <div className="input-wrapper">
          <input
            className="login-input"
            type="text"
            name="username"
            placeholder="Correo o usuario"
            autoComplete="username"
            // onChange: cada vez que el usuario escribe, actualizamos el estado
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <div className="password-field">
            <input
              className="login-input has-link"
              type="password"
              name="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className="forgot-link">
              ¿Se Te
              <br />
              Olvido?
            </a>
          </div>
        </div>



        {/* onClick: llamamos a handleLogin cuando el usuario hace clic */}
        {/* disabled: bloqueamos el botón mientras carga para evitar doble clic */}
        <button
          className="btn-login"
          onClick={sigIn}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        <div className="divider">o</div>

        <div className="social-btns">
          <button className="btn-social">
            <svg viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button className="btn-social">
            <svg viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="login-footer-text" style={{ marginTop: "16px" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={{ color: "#D3ABB0", fontWeight: 800, textDecoration: "none" }}>
            Regístrate aquí
          </Link>
        </div>

        <div className="login-footer-text">
          Al registrarte en Vulcano, aceptas nuestros
          <a href="#">Términos</a> y<a href="#">Política de privacidad</a>.
        </div>

        <div className="login-footer-divider"></div>

        <div className="login-footer-text">
          Esta página está protegida por reCAPTCHA Enterprise.
          <br />
          Aplican tanto la <a href="#">política de privacidad</a> como los
          <a href="#">términos del servicio</a> de Google.
        </div>
      </div>
    </div>
  );
};

export default VulcanoLogin;
