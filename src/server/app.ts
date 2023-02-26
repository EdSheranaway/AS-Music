import express from 'express';
import path from 'path';
import config from 'config';
import cookieParser from 'cookie-parser';
import { connect, logger } from '@utils';
import deserializeUser from './middleware/deserializeUser';
import { ErrorHandler, IMiddleware } from '@serverTypes';
import authRouter from './routes/oAuth';
const app = express();
const port = config.get<number>('port');

app.use(express.json());
app.use(deserializeUser);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist/assets')));
// routers
app.use('/oAuth', authRouter);
// app.use('/user', userRouter);

app.get<IMiddleware>('/', (_req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.use<IMiddleware>('*', (_req, res) => {
  res.status(404).send("the page you're looking for doesn't exist");
});

const errorhandler: ErrorHandler = (err, _req, res, _next) => {
  const defaultError = {
    log: 'Error occured in unknown middleware',
    status: 500,
    message: { err: 'Unknown error occured' },
  };

  const errorObj = Object.assign({}, defaultError, err);

  if (errorObj.log)
    logger.error(
      '\nlog: ' +
        errorObj.log +
        '\nstatus: ' +
        errorObj.status.toString() +
        '\nmessage: ' +
        errorObj.message.err
    );
  return res.status(errorObj.status).json(errorObj.message);
};
app.use(errorhandler);

export default app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
});
