import express, { NextFunction, Request, Response, Express } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { IMiddleware } from './serverTypes';
import authRouter from './routes/auth';
import { connect, ConnectOptions, set } from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
const app: Express = express();
const PORT = config.server.port;

const connectToDb = () => {
  set('strictQuery', false);
  connect(config.mongo.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'AS-Music',
  } as ConnectOptions)
    .then(() => Logging.info('Connected To Mongo <(^_^)>'))
    .catch((e: Error) =>
      Logging.error(`Error happened connecting to db: ${e.message}`)
    );
};

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist/assets')));

// routers
app.use('/auth', authRouter);

app.get<IMiddleware>('/', (_req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.use<IMiddleware>('*', (_req, res) => {
  res.status(404).send("the page you're looking for doesn't exist");
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const defaultErr = {
    log: `GLOBAL ERROR HANDLER: caught unknown middleware error${err.toString()}`,
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  if (errorObj.log) console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  Logging.info(`Server listening at http://localhost:${PORT}`);
});
