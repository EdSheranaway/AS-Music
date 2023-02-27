import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { object, string, TypeOf } from 'zod';

const createUserSchema = object({
  name: string().min(1, {
    message: 'Name is required',
  }),
  password: string()
    .min(8, 'Password too short - should be 8 chars minimum')
    .min(1, {
      message: 'Password is required',
    }),
  passwordConfirmation: string().min(1, {
    message: 'passwordConfirmation is required',
  }),
  email: string({
    required_error: 'Email is required',
  })
    .email('Not a valid email')
    .min(1, {
      message: 'Password is required',
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

function Register() {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const nav = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: CreateUserInput) {
    try {
      await axios.post(`${process.env.API_BASE_URL}/user/signup`, values, {
        withCredentials: true,
      });
      nav('/');
    } catch (error) {
      if (error instanceof Error) {
        setRegisterError(error.message);
      }
    }
  }
  return (
    <>
      <h1>Register Form</h1>
      <h2>
        Already have an account? <Link to="/login">Login</Link>
      </h2>
      {registerError && <p>{registerError}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            placeholder="email@email.com"
            {...register('email')}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            placeholder="Ed Sheraan"
            {...register('name')}
          />
          <p>{errors.name?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            placeholder="*********"
            {...register('password')}
          />
          <p>{errors.password?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Verify password:</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="*********"
            {...register('passwordConfirmation')}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}
export default Register;
