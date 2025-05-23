import express from 'express'
import upload from '../middleware/upload'
import { deleteFile, downloadFile, getUserFiles, renameFile, searchFiles, shareFile, uploadFile } from '../controllers/fileController'
import { isAuthenticated } from '../middleware/isAuthenticated';

const fileRoutes = express.Router();

fileRoutes.post('/upload', isAuthenticated, upload.single('File'), uploadFile);

fileRoutes.get('/', isAuthenticated, getUserFiles);

fileRoutes.delete('/:id', isAuthenticated, deleteFile);

fileRoutes.get('/search', isAuthenticated, searchFiles);

fileRoutes.put('/rename/:id', isAuthenticated, renameFile);

fileRoutes.get('/share/:id', isAuthenticated, shareFile);

fileRoutes.get('/download/:id', express.raw({ type: '*/*', limit: '50mb' }) ,isAuthenticated, downloadFile);




export default fileRoutes;