// frontend/src/components/auth/LoginForm.tsx (version connectée à l'API)
import { useState } from "react";
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

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-isra-green-dark">
          Connexion
        </CardTitle>
        <CardDescription className="text-center">
          Accédez au système de traçabilité des semences de l'ISRA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@isra.sn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <a href="#" className="text-sm text-isra-green hover:underline">
                Mot de passe oublié?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
            />
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
        <p className="text-sm text-gray-500">
          Comptes de test disponibles avec le mot de passe "12345":
          <br />
          adiop@isra.sn, fsy@isra.sn, mkane@isra.sn, ondiaye@isra.sn,
          admin@isra.sn
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
