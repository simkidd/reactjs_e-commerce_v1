import { Router } from 'express';
import cloudinary from 'cloudinary'
import auth from '../middleware/auth'
import authAdmin from '../middleware/authAdmin';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config()

const uploadRouter = Router()

// upload image on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// Upload image only admin can use
uploadRouter.post('/upload', auth, authAdmin, (req, res) => {
    try {
        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No files were uploaded.' })

        const file = req.files.file;
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: 'Size too large' })
        }
        
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: 'File format is incorrect' })
        }
        
        // Upload a file
        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (err, result) => {
            if (err) throw err;
            
            removeTmp(file.tempFilePath)

            res.send({public_id: result.public_id, url: result.secure_url})
        })


    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
})

// Delete image only admin can use
uploadRouter.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body
        if (!public_id) return res.status(400).json({ msg: "No images selected" })

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;

            res.json({ msg: "Deleted image" })
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

export default uploadRouter