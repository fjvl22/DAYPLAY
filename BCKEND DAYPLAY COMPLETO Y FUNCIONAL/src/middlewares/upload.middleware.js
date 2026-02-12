import multer from 'multer';
import fs from 'fs';

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.memoryStorage(); // Guardamos en memoria antes de procesar
export const upload = multer({ storage });
