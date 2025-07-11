// routes/uploadRoutes.js
import express from 'express';
import upload from '../utils/cloudinaryUpload.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  res.status(200).send({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path, // Cloudinary URL
  });
});

export default router;
