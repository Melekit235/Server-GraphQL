const fs = require('fs');
const path = require('path');

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File not uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
};

exports.getFiles = (req, res) => {
  fs.readdir('server/uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve files' });
    }
    res.status(200).json(files);
  });
};

exports.deleteFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
};

exports.downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../uploads', filename);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error downloading file' });
      }
    });
  });
};