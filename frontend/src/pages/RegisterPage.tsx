function RegisterPage() {
return (
	<section>
	<h1> Register </h1>
      <form className="auth-form">
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
	  </section>
);
}

export default RegisterPage;