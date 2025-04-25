import express from 'express'
import upload from '../middleware/upload'
import { deleteFile, getUserFiles, uploadFile } from '../controllers/fileController'
import { isAuthenticated } from '../middleware/isAuthenticated';

const fileRoutes = express.Router();

fileRoutes.post('/upload', isAuthenticated, upload.single('File'), uploadFile);

fileRoutes.get('/', isAuthenticated, getUserFiles);



fileRoutes.delete('/:id', isAuthenticated, deleteFile);



export default fileRoutes;