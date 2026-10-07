const dotenv = require('dotenv');
const path = require('path');

const environment = process.argv[2];

const environments = {
    dev: '.env.dev',
    test: '.env.test',
    prod: '.env.prod'
};

if (!environment || !environments[environment]) {
    console.error('You must specify an environment: dev, test, or prod.');
    process.exit(1);
}

const envFile = environments[environment];

dotenv.config({ path: path.join(__dirname, '..', envFile) });

console.log(`Entorno: ${environment}`);
console.log(`Archivo: ${envFile}`);