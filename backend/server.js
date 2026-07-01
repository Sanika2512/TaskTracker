const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env'), quiet: true });

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection. Shutting down...');
  console.error(err.name, err.message);
  if (!server) {
    process.exit(1);
  }
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  if (server) {
    server.close(() => console.log('Process terminated.'));
  }
});
