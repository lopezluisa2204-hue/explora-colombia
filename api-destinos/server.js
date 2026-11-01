//con este archivo se busca crear el server de la app//

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Permite recibir datos JSON en las solicitudes
app.use(express.json());

// Datos temporales de nuestra API
let destinos = [
  {
    id: 1,
    nombre: "Jardín",
    departamento: "Antioquia",
    clima: "Templado",
    actividad: "Visitar cascadas"
  },
  {
    id: 2,
    nombre: "Cartagena",
    departamento: "Bolívar",
    clima: "Cálido",
    actividad: "Recorrer la ciudad amurallada"
  },
  {
    id: 3,
    nombre: "Salento",
    departamento: "Quindío",
    clima: "Frío",
    actividad: "Caminar por el Valle del Cocora"
  }
];

// GET: consultar todos los destinos
app.get("/api/destinos", (req, res) => {
  res.json(destinos);
});

// GET: consultar un destino por su ID
app.get("/api/destinos/:id", (req, res) => {
  const id = Number(req.params.id);

  const destino = destinos.find(d => d.id === id);

  if (!destino) {
    return res.status(404).json({
      mensaje: "Destino no encontrado"
    });
  }

  res.json(destino);
});

// POST: crear un destino
app.post("/api/destinos", (req, res) => {
  const { nombre, departamento, clima, actividad } = req.body;

  if (!nombre || !departamento ) {
    return res.status(400).json({
      mensaje: "Debes enviar nombre y departamento"
    });
  }

  const nuevoDestino = {
    id: Date.now(),
    nombre,
    departamento,
    clima,
    actividad
  };

  destinos.push(nuevoDestino);
  res.status(201).json(nuevoDestino);
});



// DELETE: eliminar un destino
app.delete("/api/destinos/:id", (req, res) => {
  const id = Number(req.params.id);

  const existe = destinos.some(destino =>destino.id ===id)

  if (!existe) {
    return res.status(404).json({
      mensaje: "Destino no encontrado"
    });
  }

  destinos = destinos.filter(destino=>destino.id !==id)

  res.json({
    mensaje: "Destino eliminado correctamente"
  });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0",() => {
  console.log(`API activa en http://localhost:${PORT}`);
});