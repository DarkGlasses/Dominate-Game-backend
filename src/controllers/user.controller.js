const prisma = require('../prisma');
const multer = require('multer');
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Store files in the 'images' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); 
  }
});

const upload = multer({ storage: storage });

exports.getUsers = async (req, res) => {
    const users = await prisma.users.findMany();

    try {
        res.status(201).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.getUserById = async (req, res) => {
    const id = parseInt(req.params.id)
    if (!id) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid user ID'});
    }

    try {
        const userId = await prisma.users.findUnique({
            where: { id }
        });

        if (!userId) {
            return res.status(404).json({ 
                status: 'error', 
                message: `User with ID : ${id} not found` 
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Details of user ID : ${id}`,
            data: userId
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.createUser = async (req, res) => {
    upload.single('profile')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Error uploading file' 
            });
        }
    
    const { username, email, password, role } = req.body;   
    const profile = req.file ? req.file.filename : null;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                profile,
                role,
                password: hashedPassword
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: newUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
    });
};

exports.updateUser = async (req, res) => {
    upload.single('profile')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: 'Error uploading file'
            });
        }
    const userId = Number(req.params.id);
    const { username, email, password, role } = req.body; 
    const profile = req.file ? req.file.filename : null;

    if (!Number.isInteger(userId)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid user ID'});
    }

    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                username,
                email,
                password,
                role,
                profile
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'User updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
    });
};

exports.deleteUser = async (req, res) => {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid user ID'});
    }

    try {
        await prisma.users.delete({
            where: { id: userId }
        });
        
        res.status(200).json({
            status: 'success',
            message: `User with ID : ${userId} has been deleted`
        }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};