
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MOCK_USERS } from '@/utils/seedTypes';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login authentication
    setTimeout(() => {
      const user = MOCK_USERS.find(user => user.email === email);
      
      if (user && password === '12345') {  // Simple password for demo
        // In a real app, we would store auth token, user data, etc.
        localStorage.setItem('isra_user', JSON.stringify(user));
        toast.success('Connexion réussie');
        navigate('/dashboard');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-isra-green-dark">Connexion</CardTitle>
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
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-isra-green hover:bg-isra-green-dark"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <p className="text-sm text-gray-500">
          Pour les tests, utilisez un des emails suivants avec le mot de passe "12345":<br />
          adiop@isra.sn, fsy@isra.sn, mkane@isra.sn
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
