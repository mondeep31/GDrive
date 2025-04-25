import multer from 'multer'

const storage = multer.memoryStorage(); // so we can pass the buffer to s3
const upload = multer({ storage });

export default upload;