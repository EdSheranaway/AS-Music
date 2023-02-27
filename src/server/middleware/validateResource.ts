import { AnyZodObject } from 'zod';
import chalk from 'chalk';
import { IMiddleware, RequestBody } from '@serverTypes';

const validateRe =
  (schema: AnyZodObject): IMiddleware =>
  (req, _res, next): void => {
    try {
      schema.parse({
        body: req.body as RequestBody,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) {
      const errorObj = error as {
        errors?: [
          { code: string; expected: string; received: string; message: string }
        ];
      };
      if (errorObj.errors && errorObj.errors[0]) {
        const { code, expected, received, message } = errorObj.errors[0];
        return next({
          log: `Zod Validation error of type ${chalk.red(
            code
          )} occured while validating resources: expected ${chalk.green(
            expected
          )} but received ${chalk.redBright(received)}.`,
          status: 403,
          message: {
            err: `${code}: ${message}`,
          },
        });
      }
    }
  };

export default validateRe;
