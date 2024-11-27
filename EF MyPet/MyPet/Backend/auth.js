const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();  

const encriptarContrasena = (password) => {
  // Add more robust validation
  if (!password || typeof password !== 'string' || password.trim() === '') {
    throw new Error("La contraseña es requerida y debe ser un string válido");
  }
  return bcrypt.hashSync(password.trim(), 10);
};

const compararContrasena = (password, hash) => {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compareSync(password, hash);
};

const generarToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  
  if (!secretKey) {
    throw new Error("JWT_SECRET no está definida en las variables de entorno");
  }

  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    }, 
    secretKey, 
    { expiresIn: '1h' }
  );
};

const verificarToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(403).json({ message: "No se proporcionó un token" });
    }

    const tokenLimpio = token.startsWith("Bearer ") ? token.slice(7) : token;

    jwt.verify(tokenLimpio, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token inválido o expirado" });
      }

      req.user = decoded; // Store the complete decoded user
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al verificar el token" });
  }
};


const verificarRecaptcha = async (recaptchaResponse) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Asegúrate de tener esta clave en tus variables de entorno
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  const response = await axios.post(url);
  return response.data.success;
};



module.exports = { encriptarContrasena, compararContrasena, generarToken, verificarToken, verificarRecaptcha };