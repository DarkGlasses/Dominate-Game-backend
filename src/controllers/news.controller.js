const prisma = require('../prisma');
const multer = require('multer');

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

exports.getNews = async (req, res) => {
    try {
        const news = await prisma.news.findMany();

        res.status(200).json({
            status: 'success',
            message: 'News retrieved successfully',
            data: news
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
}

exports.getNewsById = async (req, res) => {
    const newsId = parseInt(req.params.id);

    if (isNaN(newsId)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid news ID' 
        });
    }

    try {
        const newsItem = await prisma.news.findUnique({
            where: { id: newsId }
        });

        res.status(200).json({
            status: 'success',
            message: `News item with ID : ${newsId} retrieved successfully`,
            data: newsItem
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.createNews = async (req, res) => {
    upload.single('picture')(req, res, async function (err) {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: 'Error uploading file'
            });
        }
    const { headline, content } = req.body;
    const picture = req.file ? req.file.path : null;

    try {
        const newNews = await prisma.news.create({
            data: {
                headline,
                content,
                picture,
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'News item created successfully',
            data: newNews
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

exports.updateNews = async (req, res) => {
    upload.single('picture')(req, res, async function (err) {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: 'Error uploading file'
            });
        }

    const newsId = parseInt(req.params.id);
    const { headline, content } = req.body;
    const picture = req.file ? req.file.path : null;

    if (isNaN(newsId)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid news ID' 
        });
    }
    
    try {
        const updatedNews = await prisma.news.update({
            where: { id: newsId },
            data: {
                headline,
                content,
                picture,
            }
        });

        res.status(200).json({
            status: 'success',
            message: `News item with ID : ${newsId} has been updated`,
            data: updatedNews
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

exports.deleteNews = async (req, res) => {
    const newsId = parseInt(req.params.id);
    
    try {
        await prisma.news.delete({
            where: { id: newsId }
        });

        res.status(200).json({
            status: 'success',
            message: `News item with ID : ${newsId} has been deleted`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};