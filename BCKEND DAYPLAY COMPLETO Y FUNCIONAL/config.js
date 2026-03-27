const dotenv = require('dotenv');
const fs = require('fs');

const ENV = process.argv[2] || 'dev';

const allowedEnvs = ['dev', 'test', 'prod'];
if (!allowedEnvs.includes(ENV)) {
  throw new Error(`Entorno no válido: ${ENV}. Usa ${allowedEnvs.join(', ')}`);
}

const envMap = {
  dev: '.env.dev',
  test: '.env.test',
  prod: '.env.prod',
};

const path = require('path');
const envFile = path.resolve(__dirname, envMap[ENV]);
if (!fs.existsSync(envFile)) {
  throw new Error(`Archivo de variables de entorno no encontrado: ${envFile}`);
}

console.log('📄 Cargando archivo de entorno:', envFile);

const result = dotenv.config({ path: envFile });

if (result.error) {
  console.error('❌ Error cargando .env:', result.error);
} else {
  console.log('✅ .env cargado correctamente');
  console.log('🌍 Variables de entorno cargadas:');
  console.log({
    PORT: process.env.PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'LOADED ✅' : 'MISSING ❌'
  });
  console.log('🔎 process.env completo:', process.env);
}

module.exports = {
  ENV,
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};