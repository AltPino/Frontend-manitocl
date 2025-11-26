import "./Nosotros.css";

export default function Nosotros() {
  return (
    <div className="nosotros-wrapper">
      <h1>Sobre Manito.cl</h1>

      <p className="nosotros-intro">
        Manito.cl es una plataforma creada para conectar voluntarios con
        organizaciones que necesitan apoyo en distintas causas sociales.
      </p>

      <div className="nosotros-section">
        <h2>¿Quiénes somos?</h2>
        <p>
          Somos un proyecto enfocado en fomentar el voluntariado, el impacto
          social y la colaboración entre personas y organizaciones.
        </p>
      </div>

      <div className="nosotros-section">
        <h2>¿Qué hacemos?</h2>
        <ul>
          <li>Conectamos voluntarios con ONG’s</li>
          <li>Facilitamos la gestión de convocatorias</li>
          <li>Otorgamos certificados y medallas</li>
          <li>Promovemos el impacto social</li>
        </ul>
      </div>

      <div className="nosotros-section">
        <h2>Nuestra misión</h2>
        <p>
          Facilitar el acceso al voluntariado, promoviendo la participación
          activa en causas sociales.
        </p>
      </div>
    </div>
  );
}
