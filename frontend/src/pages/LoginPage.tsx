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
      <p>
        If you don't have an account,<Link to="/register" className="link">Click here</Link>
      </p>
      </section>
  );
}

export default LoginPage;
