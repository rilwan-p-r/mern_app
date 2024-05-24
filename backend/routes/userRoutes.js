import express from 'express'
import {
    authUser,
    getUserProfile,
    logoutUser,
    registerUser,
    updateUserProfile
} from '../controllers/userController.js'
const router = express.Router()
import { protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js'

router.post('/', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('image'), updateUserProfile)



export default router