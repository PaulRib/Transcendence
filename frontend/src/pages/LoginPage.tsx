import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <section>
      <h1>Login</h1>
      <form className="auth-form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      If you don't have account <Link to="RegisterPage.tsx"> Click here</Link>
      </section>
  );
}

export default LoginPage;
/* Temp Login de test*/