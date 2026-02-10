require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const PORT = process.env.PORT || 3000;
const gameRoutes = require('./routes/game.route');
const newsRoutes = require('./routes/news.route'); 
const userRoutes = require('./routes/user.route');
const CommunityPostRoutes = require('./routes/communityPost.route');
const authRoutes = require('./routes/auth.route');

app.use(express.json());
app.use('/images', express.static('images'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.use('/games', gameRoutes);

app.use('/communityPost', CommunityPostRoutes);

app.use('/news', newsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to GameDominate+');
}); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
