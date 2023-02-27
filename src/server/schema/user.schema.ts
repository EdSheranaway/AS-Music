import { object, string, TypeOf } from 'zod';
export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is Required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
