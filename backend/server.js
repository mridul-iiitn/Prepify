require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config');

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
};

startServer();
