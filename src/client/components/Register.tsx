// import { useForm } from 'react-hook-form';

function Register() {
  return (
    <>
      <form>
        <label>
          Email:
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@email.com"
          />
        </label>
      </form>
    </>
  );
}

export default Register;
