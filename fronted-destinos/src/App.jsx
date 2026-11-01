import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [destinos, setDestinos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [clima, setClima] = useState("");
  const [actividad, setActividad] = useState("");

    const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem("favoritos");
    return guardados ? JSON.parse(guardados) : [];
  });

    const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api/destinos";

  // Consultar los destinos
  const cargarDestinos = async () => {
    try {
      const respuesta = await fetch(API);
      const datos = await respuesta.json();
      setDestinos(datos);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    cargarDestinos();
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  // Agregar un destino
  const agregarDestino = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          departamento,
          clima,
          actividad
        })
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo agregar el destino");
      }

      setNombre("");
      setDepartamento("");
      setClima("");
      setActividad("");

      cargarDestinos();

    } catch (error) {
      alert(error.message);
    }
  };

 // Eliminar un destino
  const eliminarDestino = async (id) => {
    if (!window.confirm("¿Deseas eliminar este destino?")) {
      return;
    }

    try {
      const respuesta = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar");
      }

      cargarDestinos();

    } catch (error) {
      alert(error.message);
    }
  };

  // Marcar o quitar un favorito
  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favId) => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  return (
    <div className="contenedor">

        <header className="portada">
        <h1 className="titulo">Explora nuestro país</h1>
        <p className="subtitulo">Descubre los destinos más bonitos de Colombia</p>
      </header>

      <section className="formulario">
          <h2>✈️ Agregar nuevo destino</h2>

        <form onSubmit={agregarDestino}>

          <input
            type="text"
            placeholder="Nombre del destino"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            required
          />

              <input
            type="text"
            placeholder="Clima (ej: Cálido, Templado, Frío)"
            value={clima}
            onChange={(e) => setClima(e.target.value)}
          />

          <input
            type="text"
            placeholder="Actividad principal (ej: Senderismo)"
            value={actividad}
            onChange={(e) => setActividad(e.target.value)}
          />

           <button type="submit">
            + Agregar destino
          </button>

        </form>
      </section>

      <section className="lista">
        <h2>🗺️ Destinos disponibles</h2>

                {destinos.length === 0 && (
          <p className="vacio">🧳 Aún no hay destinos. ¡Agrega el primero!</p>
        )}

        {destinos.map((destino) => (
          <article className="destino" key={destino.id}>

            <div>
              <h3>{destino.nombre}</h3>
              <p>📍 {destino.departamento}</p>
              {destino.clima && <p>🌤️ {destino.clima}</p>}
              {destino.actividad && <p>🥾 {destino.actividad}</p>}
            </div>

            

              <div className="acciones">
              <button
                className="eliminar"
                onClick={() => eliminarDestino(destino.id)}
              >
                Eliminar
              </button>

              <button
                className={`favorito ${favoritos.includes(destino.id) ? "activo" : ""}`}
                onClick={() => toggleFavorito(destino.id)}
                title="Marcar como favorito"
              >
                ♥
              </button>
            </div>

          </article>
        ))}

      </section>

    </div>
  );
}

export default App;

