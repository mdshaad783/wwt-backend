import path from "path";
import express from "express";
import multer from 'multer'
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router()
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/')
    },
    filename:(req,file,cb)=>{
        const extname = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${extname}`)
    }
})

const fileFilter = (req,file,cb)=>{
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = path.extname(file.originalname).toLowerCase()
    const mimetype = file.mimetype

    if(filetypes.test(extname) && mimetypes.test(mimetype)){
        cb(null, true)
    }else{
        cb(new Error("Images Only..."), false)
    }
} 

const upload = multer({storage, fileFilter})
const uploadSingleImage = upload.single('image')

router.post('/', (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded..." });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      // Remove local file after upload
      fs.unlinkSync(req.file.path);

      res.status(200).send({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url, // ✅ Cloudinary URL
      });
    } catch (uploadError) {
      console.error("Cloudinary error:", uploadError);
      res.status(500).send({ message: "Image upload failed" });
    }
  });
});

export default router