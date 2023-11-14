import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { object, string, TypeOf } from 'zod';

const createSessionSchema = object({
  email: string().min(1, {
    message: 'Email is necessary',
  }),
  password: string()
    .min(6, 'Password too short - must be 6 chars minimum')
    .min(1, {
      message: 'Password is required',
    }),
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>;

function Login() {
  const [regisetError, setRegisterError] = useState<string | null>(null);
  const nav = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  async function onSubmit(values: CreateSessionInput) {
    try {
      const newUser = await axios.post(
        `${process.env.API_BASE_URL}/user/login`,
        values,
        { withCredentials: true }
      );
      if (newUser) {nav('/');}
      
    } catch (error) {
      if (error instanceof Error) {
        setRegisterError(error.message);
      }
    }
  }
  return (
    <>
      {regisetError && <p>{regisetError}</p>}
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
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            placeholder="*********"
            {...register('password')}
          />
          <p>{errors.password?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}
export default Login;
