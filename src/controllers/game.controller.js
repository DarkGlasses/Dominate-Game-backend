const prisma = require('../prisma');
const multer = require('multer');
const { connect } = require('../routes/auth.route');

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

exports.getGames = async (req, res) => {
    try {
        const games = await prisma.games.findMany();

        res.status(200).json({
            status: 'success',
            message: 'Games retrieved successfully',
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
}

exports.getGameById = async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid game ID' 
        });
    }

    try {
        const gameId = await prisma.games.findUnique({
            where: { id },
            include: { reviews: true }
        });

        if (!gameId) {
            return res.status(404).json({ 
                status: 'error', 
                message: `ame ID : ${id} not found` 
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Details of game ID : ${id}`,
            data: gameId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    } 
    
}

exports.getGameByTitle = async (req, res) => {
    const title = req.query.title;
    
    if (!title) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Title query parameter is required' 
        });
    }

    try {
        const gameByTitle = await prisma.games.findMany({
            where: {
                title: title
            },
            select: { id: true, title: true },
        });
        
        res.status(200).json({
            status: 'success',
            message: `Games matching title : ${title}`,
            data: gameByTitle
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.getGameByGenre = async (req, res) => {
    const genre = req.query.genre?.trim();

    if (!genre) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Genre query parameter is required' 
        });
    }

    try {
        const gamesByGenre = await prisma.games.findMany({
            where: {
                genre: {
                    array_contains: genre
                }
            },
            select: { id: true, title: true, genre: true},
        });
        
        res.status(200).json({
            status: 'success',
            message: `Games of genre : ${genre}`,
            data: gamesByGenre
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.getGameByPlatform = async (req, res) => {
    const platform = req.query.platform?.trim();

    if (!platform) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Platform query parameter is required' 
        });
    }

    try {
        const gamesByPlatform = await prisma.games.findMany({
            where: {
                platform: {
                    array_contains: platform
                }
            },
            select: { id: true, title: true, platform: true},
        });

        if (gamesByPlatform.length === 0) {
            return res.status(404).json({ 
                status: 'error',   
                message: `No games found for platform : ${platform}`
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Games of platform : ${platform}`,
            data: gamesByPlatform
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.getGameByDeveloper = async (req, res) => {
    const developer = req.query.developer;

    if (!developer) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Developer query parameter is required' 
        });
    }

    try {
        const gamesByDeveloper = await prisma.games.findMany({
            where: {
                developer: developer
            },
            select: { id: true, title: true, developer: true},
        });
        
        res.status(200).json({
            status: 'success',
            message: `Games by developer : ${developer}`,
            data: gamesByDeveloper
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({  
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.getGameByPublisher = async (req, res) => {
    const publisher = req.query.publisher;

    if (!publisher) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Publisher query parameter is required' 
        });
    }

    try {
        const gamesByPublisher = await prisma.games.findMany({
            where: {
                publisher: publisher
            },
            select: { id: true, title: true, publisher: true},
        });
        
        res.status(200).json({
            status: 'success',
            message: `Games by publisher : ${publisher}`,
            data: gamesByPublisher
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.createGame = async (req, res) => {
    upload.single('picture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: 'Error uploading file'
            });
        }

        const { title, developer, publisher, rating, releaseDate } = req.body;
        const picture = req.file ? req.file.path : null;
        const genre = JSON.parse(req.body.genre);
        const platform = JSON.parse(req.body.platform);

    try {
        const newGame = await prisma.games.create({
            data: {
                title,
                genre: genre, 
                platform: platform,
                developer,
                publisher,
                rating,
                picture,
                releaseDate: new Date(releaseDate)
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Game created successfully',
            data: newGame
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    };
    });
};

exports.updateGame = async (req, res) => {
    upload.single('picture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: 'Error uploading file'
            });
        }

    const gameId = parseInt(req.params.id);
    const { title, developer, publisher, rating, releaseDate } = req.body;
    const picture = req.file ? req.file.path : null;
    const genre = JSON.parse(req.body.genre);
    const platform = JSON.parse(req.body.platform);

    try {
        const updatedGame = await prisma.games.update({
            where: { id: gameId },
            data: {
                title,
                genre,
                platform,       
                developer,
                publisher,
                rating: Number(rating),
                picture,
                releaseDate: new Date(releaseDate)
            }
        });
        res.status(200).json({
            status: 'success',
            message: `Game with ID : ${gameId} has been updated`,
            data: updatedGame
        });
            
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        })
    }
    });
};

exports.deleteGame = async (req, res) => {
    const gameId = req.params.id;

    try {
        await prisma.games.delete({
            where: { id: parseInt(gameId) }
        });

        res.status(200).json({
            status: 'success',
            message: `Game with ID : ${gameId} has been deleted`
        }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.createGameReview = async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const userId = req.user.id;
    const { rating, comment } = req.body;

    try {
        const newReview = await prisma.reviews.create({
            data: {
                rating,
                comment,
        
                user: {
                    connect: { id: userId }
                },
                game: {
                    connect: { id: parseInt(gameId) }
                }
            },

            include: { 
                user: {
                    select: {id: true, username: true}
                },
                game: {
                    select: {id: true, title: true}
                },
            },

        });
        res.status(201).json({
            status: 'success',
            message: 'Review created successfully',
            data: newReview
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.getGameReviews = async (req, res) => {
    const gameId = parseInt(req.params.gameId);

    try {
        const reviews = await prisma.reviews.findMany({
            where: { gameId },
            include: { 
                user: {
                    select: { id: true, username: true}
                }
            }
        });

        res.status(200).json({
            status: 'success',
            message: `Reviews for game ID : ${gameId}`,
            data: reviews
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.getGameReviewById = async (req, res) => {
    const gameId = Number(req.params.gameId);
    const reviewId = Number(req.params.reviewId);

    if (!Number.isInteger(gameId) || !Number.isInteger(reviewId)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid game ID or review ID' 
        });
    }

    try {
        const review = await prisma.reviews.findUnique({
            where: {
                id: reviewId,
                gameId: gameId
            },
            include: { user: {
                select: { id: true, username: true }
            } }
        });

        res.status(200).json({
            status: 'success',
            message: `Review ID : ${reviewId} for game ID : ${gameId}`,
            data: review
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.updateGameReview = async (req, res) => {
    const gameId = Number(req.params.gameId);
    const reviewId = Number(req.params.reviewId);
    const { rating, comment } = req.body;

    if (!Number.isInteger(gameId) || !Number.isInteger(reviewId)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid game ID or review ID' 
        });
    }
    
    try {
        const review = await prisma.reviews.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            return res.status(404).json({ 
                status: 'error', 
                message: `Review ID : ${reviewId} not found` 
            });
        }

        const updatedReview = await prisma.reviews.update({
            where: {    id: reviewId },
            data: {
                rating,
                comment
            }
        });

        res.status(200).json({
            status: 'success',
            message: `Review ID : ${reviewId} for game ID : ${gameId} has been updated`,
            data: updatedReview
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }
};

exports.deleteGameReview = async (req, res) => {
    const gameId = Number(req.params.gameId);
    const reviewId = Number(req.params.reviewId);

    if (!Number.isInteger(gameId) || !Number.isInteger(reviewId)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid game ID or review ID' 
        });
    }

    try {
        await prisma.reviews.delete({
            where: {
                id: reviewId,
                gameId: gameId
            }
        });

        res.status(200).json({
            status: 'success',
            message: `Review ID : ${reviewId} for game ID : ${gameId} has been deleted`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
        });
    }   
};