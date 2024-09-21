const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authenticateJWT');
const fileController = require('../controllers/fileController');

module.exports = (upload) => {
  
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/logout', authController.logout);
  
  router.post('/upload', authenticateJWT, upload.single('file'), fileController.uploadFile);
  router.get('/files', authenticateJWT, fileController.getFiles);
  router.delete('/files/:filename', authenticateJWT, fileController.deleteFile);
  router.get('/files/download/:filename', authenticateJWT, fileController.downloadFile);
  
  return router;
};
