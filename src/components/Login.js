import React from 'react'

function Login() {
  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form>
        <label>Email :</label>
        <input type="email" placeholder="Entrez votre email" required />

        <label>Mot de passe :</label>
        <input type="password" placeholder="Entrez votre mot de passe" required />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}

export default Login
