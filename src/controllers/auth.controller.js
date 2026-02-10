const prisma = require("../prisma");
const multer = require("multer");
const bcrypt = require("bcrypt");
const authService = require("../services/auth.service");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const role = (email === ADMIN_EMAIL) ? 'admin' : 'user';
    const token = authService.generateToken({
      id: user.id,
      email: user.email,
      role: role
     });

    res.json({
      status: "success",
      message: "Login successfully",
      token,
      role,
      user,
    });
  } catch (error) {
    res.status(500).json({ 
        error: error.message 
    });
  }
};

exports.register = async (req, res) => {
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

    const exist = await prisma.users.findUnique({ where: { email } });
    if (exist) {
        return res.status(400).json({ message: "Email already exists" });
    }
    try {
        const user = await prisma.users.create({
        data: {
            email,
            username,
            password: hashedPassword,
            role,
            profile
        }
    });

    res.status(201).json({
        message: "Register success",
        user
    });
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
        }
    });
};

exports.getProfile = async (req, res) => {
  const { email, role } = req.user;

  res.json({ email, role });

  try {
    const user = await prisma.users.findUnique(
      { 
        where: { email } 
      }
    ); 
    if (!user) {
      return res.status(404).json(
        { 
        error: "User not found" 
      }
    );
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json(
      { 
      error: error.message 
    }
  );
  }
};

