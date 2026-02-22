import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/libraryhub',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
};
