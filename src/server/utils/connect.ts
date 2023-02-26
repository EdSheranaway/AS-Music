import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connect() {
  const dbUri = config.get<string>('dbUri');
  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(dbUri);
    return logger.info('Connected to Db');
  } catch (error) {
    logger.error('could not connect to db', error);
    process.exit(1);
  }
}

export default connect;
