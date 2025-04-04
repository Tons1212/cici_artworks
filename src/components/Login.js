import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import des icônes

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");

        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const response = await axios.post("http://localhost:5000/login", { email, password });
            const token = response.data.token;
    
            localStorage.setItem("token", token);
            setToken(token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
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
                        type={showPassword ? "text" : "password"} // Affiche ou cache le mot de passe
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
