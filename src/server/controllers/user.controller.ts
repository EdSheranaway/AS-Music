import { compare } from 'bcryptjs';
import { IUserController } from '@serverTypes';
import { UserModel } from '@models';

const userController: IUserController = {
  signup: async (req, res, next) => {
    const { name, password, email } = req.body;
    try {
      const user = await UserModel.create({ name, password, email });

      const returnNewUser = {
        email: user.email,
        name: user.name,
        userId: user._id,
      };
      res.locals.user = returnNewUser;
      return next();
    } catch (error) {
      return next({
        log: `Error occured in userController.signup: ${error}`,
        status: 400,
        message: { err: `User already exists!` },
      });
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return next({
          status: 401,
          message: 'User not found: please check your email and/or password',
        });
      }
      const validPass = await compare(password, user.password);

      if (validPass) {
        res.locals.user = { userId: user._id, name: user.name };
      } else {
        return next({
          log: 'null',
          status: 401,
          message: 'User not found: please check your email and/or password',
        });
      }
      return next();
    } catch (error) {
      return next({
        log: `Error occured in userController.login: ${error}`,
        status: 401,
        message: { err: `${error}` },
      });
    }
  },
};

export default userController;
