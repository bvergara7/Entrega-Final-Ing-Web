const express = require("express");
const connection = require("./database");
const bodyparser = require("body-parser");
const { verificarToken, encriptarContrasena, compararContrasena, generarToken } = require("./auth");
const cors = require("cors");
const app = express();

app.use(bodyparser.json());
app.use(cors());

// ======= Autenticación =======
app.post("/login", (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ message: "Email y contraseña son requeridos" });
  }

  const query = "SELECT * FROM usuario WHERE email = ?";
  connection.query(query, [email], (error, resultado) => {
    if (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ message: "Error al verificar usuario" });
    }

    if (resultado.length === 0 || !compararContrasena(contraseña, resultado[0].contraseña)) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = generarToken(resultado[0]);
    res.status(200).json({ 
      message: "Autenticado exitosamente", 
      token,
      usuario: {
        id: resultado[0].id,
        email: resultado[0].email,
        nombre: resultado[0].nombre,
        fotoPerfil: resultado[0].fotoPerfil
      }
    });
  });
});

// ======= Usuarios =======
app.post("/usuario", (req, res) => {
  const { nombre, email, contraseña, idRegion } = req.body;
  
  if (!email || !contraseña || !nombre || !idRegion) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Formato de email inválido" });
  }

  // Verificar si el usuario ya existe
  const checkUserQuery = "SELECT id FROM usuario WHERE email = ?";
  connection.query(checkUserQuery, [email], (error, userResults) => {
    if (error) {
      console.error("Error al verificar usuario:", error);
      return res.status(500).json({ message: "Error al verificar email" });
    }

    if (userResults.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const passwordHash = encriptarContrasena(contraseña);
    const insertQuery = "INSERT INTO usuario(nombre, email, contraseña, idRegion) VALUES (?, ?, ?, ?)";
    
    connection.query(insertQuery, [nombre, email, passwordHash, idRegion], (error, resultado) => {
      if (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({ message: "Error al crear usuario" });
      }
      res.status(201).json({ 
        message: "Usuario creado exitosamente",
        userId: resultado.insertId
      });
    });
  });
});



app.get("/usuario/:id", verificarToken, (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ message: "No autorizado para ver este perfil" });
  }

  const query = `
    SELECT u.nombre, u.email, u.fotoPerfil, u.idRegion, r.nombreRegion 
    FROM usuario u 
    LEFT JOIN region r ON u.idRegion = r.idRegion
    WHERE u.id = ?
  `;

  
  connection.query(query, [id], (error, resultado) => {
    if (error) {
      console.error("Error al obtener usuario:", error);
      return res.status(500).json({ message: "Error al obtener usuario" });
    }
    if (resultado.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log(resultado[0]);
    res.status(200).json(resultado[0]);
  });
});

// Actualizar perfil de usuario
app.put("/usuario/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, email, contraseña, fotoPerfil, idRegion } = req.body;
  
  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ message: "No autorizado para modificar este usuario" });
  }

  let query = "UPDATE usuario SET";
  const values = [];
  
  if (nombre) {
    query += " nombre = ?,";
    values.push(nombre);
  }
  
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido" });
    }
    query += " email = ?,";
    values.push(email);
  }
  
  if (contraseña) {
    const passwordHash = encriptarContrasena(contraseña);
    query += " contraseña = ?,";
    values.push(passwordHash);
  }

  if (fotoPerfil) {
    query += " fotoPerfil = ?,";
    values.push(fotoPerfil);
  }

  if (idRegion) {
    query += " idRegion = ?,";
    values.push(idRegion);
  }

  query = query.slice(0, -1);
  query += " WHERE id = ?";
  values.push(id);

  connection.query(query, values, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar usuario:", error);
      return res.status(500).json({ message: "Error al actualizar usuario" });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  });
});






// ======= Mascotas =======
app.post("/mascota", verificarToken, (req, res) => {
  const { nombre, especie, raza, fecha, imgMascota } = req.body;
  
  if (!nombre || !especie) {
    return res.status(400).json({ message: "Nombre y especie son requeridos" });
  }

  // Generar código de vinculación único
  const codigoVinculacion = Math.random().toString(36).substring(2, 15);

  const query = "INSERT INTO mascota(codigoVinculacion, nombre, especie, raza, fecha, imgMascota, idCuidador) VALUES (?, ?, ?, ?, ?, ?, ?)";
  connection.query(query, [codigoVinculacion, nombre, especie, raza, fecha, imgMascota, req.user.id], (error, resultado) => {
    if (error) {
      console.error("Error al crear mascota:", error);
      return res.status(500).json({ message: "Error al crear mascota" });
    }
    res.status(201).json({
      message: "Mascota creada exitosamente",
      mascotaId: resultado.insertId,
      codigoVinculacion
    });
  });
});

// Obtener mascotas del usuario
app.get("/mascotas", verificarToken, (req, res) => {
  const query = "SELECT * FROM mascota WHERE idCuidador = ?";
  connection.query(query, [req.user.id], (error, resultado) => {
    if (error) {
      console.error("Error al obtener mascotas:", error);
      return res.status(500).json({ message: "Error al obtener mascotas" });
    }
    res.status(200).json(resultado);
  });
});


app.get("/mascotas/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  
  const query = "SELECT * FROM mascota WHERE id = ?";
  connection.query(query, [id], (error, resultado) => {
    if (error) {
      console.error("Error al obtener mascota:", error);
      return res.status(500).json({ message: "Error al obtener mascota" });
    }
    
    if (resultado.length === 0) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    // Verificar que la mascota pertenezca al usuario
    if (resultado[0].idCuidador !== req.user.id) {
      return res.status(403).json({ message: "No autorizado para ver esta mascota" });
    }

    res.status(200).json(resultado[0]);
  });
});


app.put("/mascotas/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, especie, raza, fecha, peso, imgMascota } = req.body;

  // Input validation
  if (!nombre || !especie) {
    return res.status(400).json({ message: "Nombre y especie son requeridos" });
  }

  // Validate numeric ID
  const mascotaId = parseInt(id, 10);
  if (isNaN(mascotaId)) {
    return res.status(400).json({ message: "ID de mascota inválido" });
  }

  // Prepare update query
  const updateFields = [];
  const updateValues = [];

  // More robust field validation
  if (nombre) {
    updateFields.push("nombre = ?");
    updateValues.push(nombre);
  }
  if (especie) {
    updateFields.push("especie = ?");
    updateValues.push(especie);
  }
  if (raza) {
    updateFields.push("raza = ?");
    updateValues.push(raza);
  }
  if (fecha) {
    // Add date format validation if needed
    updateFields.push("fecha = ?");
    updateValues.push(fecha);
  }
  if (peso) {
    // Optional: Add numeric validation
    updateFields.push("peso = ?");
    updateValues.push(peso);
  }
  if (imgMascota) {
    updateFields.push("imgMascota = ?");
    updateValues.push(imgMascota);
  }

  // Check if there are any fields to update
  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No hay campos para actualizar" });
  }

  // Construct dynamic update query
  const updateQuery = `
    UPDATE mascota 
    SET ${updateFields.join(", ")} 
    WHERE id = ? AND idCuidador = ?
  `;

  // Add ID and user ID to values
  updateValues.push(mascotaId, req.user.id);

  connection.query(updateQuery, updateValues, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar mascota:", error);
      return res.status(500).json({ 
        message: "Error al actualizar mascota",
        error: error.message 
      });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Mascota no encontrada o no autorizada",
        details: {
          requestedId: mascotaId,
          authenticatedUserId: req.user.id
        }
      });
    }

    // Fetch updated mascota
    const getUpdatedQuery = "SELECT * FROM mascota WHERE id = ?";
    connection.query(getUpdatedQuery, [mascotaId], (fetchError, mascotaResult) => {
      if (fetchError) {
        console.error("Error al obtener mascota actualizada:", fetchError);
        return res.status(500).json({ 
          message: "Error al recuperar mascota actualizada",
          error: fetchError.message 
        });
      }

      res.status(200).json({
        message: "Mascota actualizada exitosamente",
        mascota: mascotaResult[0] || null
      });
    });
  });
});




// Vincular mascota usando código
app.post("/mascotas/vincular", verificarToken, (req, res) => {
  const { codigoVinculacion } = req.body;
  
  if (!codigoVinculacion) {
    return res.status(400).json({ message: "Código de vinculación requerido" });
  }

  const query = "UPDATE mascota SET idCuidador = ? WHERE codigoVinculacion = ?";
  connection.query(query, [req.user.id, codigoVinculacion], (error, resultado) => {
    if (error) {
      console.error("Error al vincular mascota:", error);
      return res.status(500).json({ message: "Error al vincular mascota" });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Código de vinculación inválido" });
    }
    res.status(200).json({ message: "Mascota vinculada exitosamente" });
  });
});


app.post("/evento", verificarToken, (req, res) => {
  const { titulo, fecha, descripcion, idMascota } = req.body;

  if (!titulo || !fecha || !idMascota) {
      return res.status(400).json({ message: "Título, fecha y mascota son requeridos" });
  }

  // Verificar que la mascota pertenezca al usuario
  const checkQuery = "SELECT id FROM mascota WHERE id = ? AND idCuidador = ?";
  connection.query(checkQuery, [idMascota, req.user.id], (error, resultado) => {
      if (error || resultado.length === 0) {
          return res.status(403).json({ message: "No autorizado para crear eventos para esta mascota" });
      }

      const insertQuery = "INSERT INTO evento(titulo, fecha, descripcion, idMascota) VALUES (?, ?, ?, ?)";
      connection.query(insertQuery, [titulo, fecha, descripcion, idMascota], (error, resultado) => {
          if (error) {
              console.error("Error al crear evento:", error);
              return res.status(500).json({ message: "Error al crear evento" });
          }
          res.status(201).json({
              message: "Evento creado exitosamente",
              eventoId: resultado.insertId
          });
      });
  });
});






// Obtener eventos de una mascota
app.get("/eventos/:idMascota", verificarToken, (req, res) => {
  const { idMascota } = req.params;
  
  // Verificar que la mascota pertenezca al usuario
  const checkQuery = "SELECT id FROM mascota WHERE id = ? AND idCuidador = ?";
  connection.query(checkQuery, [idMascota, req.user.id], (error, resultado) => {
    if (error || resultado.length === 0) {
      return res.status(403).json({ message: "No autorizado para ver eventos de esta mascota" });
    }

    const query = "SELECT * FROM evento WHERE idMascota = ?";
    connection.query(query, [idMascota], (error, eventos) => {
      if (error) {
        console.error("Error al obtener eventos:", error);
        return res.status(500).json({ message: "Error al obtener eventos" });
      }
      res.status(200).json(eventos);
    });
  });
});

// Elimina o invalida el token (en el caso de JWT, se borra del cliente)
app.post('/logout', verificarToken, (req, res) => {
  // Aquí no necesitas hacer nada en el servidor si solo estás manejando JWT
  // Solo debes asegurarte de que el token no sea reutilizable o que se elimine en el cliente
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});



app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});



