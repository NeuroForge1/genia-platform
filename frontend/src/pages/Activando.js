import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Activando = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const correo = searchParams.get("correo");

    if (correo) {
      // Guardar el correo en localStorage
      localStorage.setItem("genia_user_email", correo);

      // Disparar Make automáticamente
      fetch("https://hook.eu2.make.com/mgmz3k8mvpw9jts58koqwjbyvxpv2whq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo }),
      });
    }

    // Redirige automáticamente al dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Activando tu espacio GENIA...</h2>
      <p>No cierres esta ventana. Redirigiendo en segundos...</p>
    </div>
  );
};

export default Activando;
