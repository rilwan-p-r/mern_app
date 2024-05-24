import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utilis/generateToken.js'
import cloudinary from '../utilis/cloudinary.js'


const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const admin = await User.findOne({ email })
    if (admin && admin.isAdmin && (await admin.matchPassword(password))) {
        generateToken(res, admin._id, 'adminJwt')
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            profileImage: admin.profileImage
        })

    } else {
        throw new Error('Invalid email or password')
    }
})


const adminLogout = asyncHandler(async (req, res) => {
    res.cookie('adminJwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'Admin Logged out' })
})


const getUers = asyncHandler(async (req, res) => {
    console.log('getusersss');
    const userData = await User.find({ isAdmin: { $ne: true } }).select('-password').sort({ updatedAt: -1 })
    console.log(userData);
    res.status(200).json(userData)
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body._id)
    if (user) {
        if (user.profileImage) {
            const publicIdMatch = user.profileImage.match(/\/upload\/v\d+\/([^./]+)\./);
            if (publicIdMatch && publicIdMatch[1]) {
                const publicId = publicIdMatch[1];
                await cloudinary.uploader.destroy(publicId);
            } else {
                console.log('No public_id found in profileImage URL');
            }
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                user.profileImage = result.secure_url;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
            }
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;

        const updatedUser = await user.save()
        console.log("my new user",updatedUser);

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
        });

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const addNewUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    let imageUrl = 'https://avatar.iran.liara.run/public/48'

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('user already exists');
    }

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url || null;
    }

    const user = await User.create({ name, email, password, profileImage: imageUrl })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

})

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.profileImage) {
        const publicIdMatch = user.profileImage.match(/\/upload\/v\d+\/([^./]+)\./);
        if (publicIdMatch && publicIdMatch[1]) {
            const publicId = publicIdMatch[1];
            await cloudinary.uploader.destroy(publicId);
        } else {
            console.log('No public_id found in profileImage URL');
        }
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: 'User deleted' });
})

export {
    authAdmin,
    adminLogout,
    getUers,
    addNewUser,
    updateUser,
    deleteUser
}