'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { supabase } from "../../lib/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    }

    // Vérification si localStorage est disponible dans le navigateur
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem("email");
      if (savedEmail) setEmail(savedEmail);
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem("email", email);
      }
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue.");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <button type="submit">Connexion</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;