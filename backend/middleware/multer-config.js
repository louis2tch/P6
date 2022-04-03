const multer = require('multer');

const MIME_TYPES ={
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/jfif': 'jfif'  
};

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const fname = name.replace('.'+extension,'');
        callback(null, fname + Date.now()+'.'+extension);
    }
});

module.exports = multer({storage}).single('image'); 