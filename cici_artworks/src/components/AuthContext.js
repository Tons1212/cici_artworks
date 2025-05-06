'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Charger immédiatement depuis localStorage si dispo, uniquement dans le navigateur
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser(); // Récupère l'utilisateur actuel depuis Supabase
      if (data?.user) {
        setUser(data.user); // Si un utilisateur est trouvé, on le met dans l'état
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user)); // 🔥 Mettre à jour localStorage
        }
      } else {
        setUser(null); // Si aucun utilisateur n'est trouvé, on le retire de l'état
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user'); // 🔥 Nettoyer si pas d'user
        }
      }
      setLoading(false); // Une fois qu'on a récupéré les données, on n'est plus en chargement
    };

    getUserData(); // Chargement des données utilisateur initiales

    // Ecouter les changements d'état d'authentification
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user); // Si l'utilisateur est connecté
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(session.user)); // 🔥 Mise à jour sur auth change
        }
      } else {
        setUser(null); // Sinon, on déconnecte l'utilisateur
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user'); // 🔥 Nettoyer
        }
      }
    });

    // Cleanup lors de la destruction du composant
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error; // Si une erreur survient, on la lance
    setUser(data.user); // Si connexion réussie, on met l'utilisateur dans l'état
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user)); // 🔥 Stocker après login
    }
  };

  const logout = async () => {
    await supabase.auth.signOut(); // Se déconnecter via Supabase
    setUser(null); // Réinitialiser l'état de l'utilisateur
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user'); // 🔥 Nettoyer après logout
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {!loading && children} {/* Afficher les enfants seulement lorsque le chargement est terminé */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Hook pour accéder au contexte