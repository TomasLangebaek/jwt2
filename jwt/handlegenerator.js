let jwt = require('jsonwebtoken');
let config = require('./config');
var sha256 = require('js-sha256');
const fetch = require('node-fetch');

// Clase encargada de la creación del token
class HandlerGenerator {
  async login(req, res) {
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = req.body.password;
    password = sha256(password);
    // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD
    //console.log(getData(username));
    let data = await fetch(
      `http://localhost:3000/users/${username}`
    ).then((response) => response.json());

    let realPassword = data[0].password;
    let realUsername = data[0].username;
    let realRole = data[0].role;

    // Si se especifico un usuario y contraseña, proceda con la validación
    // de lo contrario, un mensaje de error es retornado
    if (username && password) {
      // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
      // de lo contrario, un mensaje de error es retornado
      if (username === realUsername && password === realPassword) {
        // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
        let token = jwt.sign(
          { username: username, role: realRole },
          config.secret,
          {
            expiresIn: '24h',
          }
        );

        // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token,
        });
      } else {
        // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password',
        });
      }
    } else {
      // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
      res.send(400).json({
        success: false,
        message: 'Authentication failed! Please check the request',
      });
    }
  }

  index(req, res) {
    // Retorna una respuesta exitosa con previa validación del token
    res.json({
      success: true,
      message: 'Index page',
    });
  }
}

module.exports = HandlerGenerator;
