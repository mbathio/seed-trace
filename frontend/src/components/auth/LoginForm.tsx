// frontend/src/components/auth/LoginForm.tsx - Version modifiée pour demo

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/api";
import { MOCK_USERS } from "@/utils/seedTypes";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("adiop@isra.sn"); // Email pré-rempli
  const [password, setPassword] = useState("12345"); // Mot de passe pré-rempli
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const loginMutation = useLogin();

  // Auto-connexion pour la démo (optionnel - décommentez si vous voulez une connexion automatique)
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const storedUser = localStorage.getItem("isra_user");
    if (storedUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email invalide";
    }

    if (!password) {
      newErrors.password = "Mot de passe requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: (error: Error) => {
          setErrors({ password: error.message });
        },
      }
    );
  };

  // Fonction pour connexion rapide
  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("12345");

    setTimeout(() => {
      loginMutation.mutate(
        { email: userEmail, password: "12345" },
        {
          onSuccess: () => {
            navigate("/dashboard");
          },
          onError: (error: Error) => {
            console.error("Erreur de connexion:", error);
            setErrors({ password: error.message });
          },
        }
      );
    }, 100);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-isra-green-dark">
          Connexion - Mode Démo
        </CardTitle>
        <CardDescription className="text-center">
          Système de traçabilité des semences de l'ISRA (Mode présentation)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Boutons de connexion rapide pour la démo */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-blue-800">
            🚀 Connexion rapide pour la démo :
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {MOCK_USERS.slice(0, 5).map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin(user.email)}
                className="text-left justify-start text-xs"
                disabled={loginMutation.isPending}
              >
                <span className="font-medium">{user.name}</span>
                <span className="ml-2 text-gray-500">({user.role})</span>
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@isra.sn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-isra-green hover:bg-isra-green-dark"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <div className="text-center">
          <p className="text-sm text-green-600 font-medium mb-2">
            ✅ Mode démo - Tous les comptes utilisent le mot de passe "12345"
          </p>
          <p className="text-xs text-gray-500">
            Utilisez les boutons rapides ci-dessus ou saisissez manuellement les
            informations
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
