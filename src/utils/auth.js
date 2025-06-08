const crypto = require('crypto');

/**
 * Hash de contraseña usando scrypt
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Contraseña hasheada
 */
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    // Generar salt aleatorio
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Hash la contraseña con scrypt
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      
      // Combinar salt y hash
      const hash = `${salt}:${derivedKey.toString('hex')}`;
      resolve(hash);
    });
  });
}

/**
 * Verificar contraseña
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado
 * @returns {Promise<boolean>} True si la contraseña es correcta
 */
function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    // Extraer salt y hash
    const [salt, storedHash] = hash.split(':');
    
    // Hash la contraseña proporcionada con el mismo salt
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      
      // Comparar hashes
      const isValid = storedHash === derivedKey.toString('hex');
      resolve(isValid);
    });
  });
}

/**
 * Generar token de autenticación aleatorio
 * @returns {string} Token único
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken
};