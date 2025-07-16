import multer from 'multer';

// Configuramos multer
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (request, file, cb) => {
        const fileName = Date.now() + '_' + file.originalname;
        cb(null, fileName);
    }
});

// Exportar instancia de multer
const upload = multer({ storage });

export default upload;
