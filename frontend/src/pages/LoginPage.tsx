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
      <div className="register-prompt">
        <span>or</span>
        <Link to="/register"><button type="button">Register</button></Link>
      </div>
      </section>
  );
}

export default LoginPage;
