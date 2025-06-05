
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MOCK_USERS } from '@/utils/seedTypes';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  field?: 'email' | 'password' | 'general';
  message: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginError[]>([]);

  const validateForm = (): boolean => {
    const newErrors: LoginError[] = [];

    if (!formData.email) {
      newErrors.push({ field: 'email', message: 'L\'email est requis' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Format d\'email invalide' });
    }

    if (!formData.password) {
      newErrors.push({ field: 'password', message: 'Le mot de passe est requis' });
    } else if (formData.password.length < 3) {
      newErrors.push({ field: 'password', message: 'Le mot de passe doit contenir au moins 3 caractères' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear errors for this field when user starts typing
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = MOCK_USERS.find(user => user.email === formData.email);
      
      if (user && formData.password === '12345') {
        // Store user data in localStorage
        localStorage.setItem('isra_user', JSON.stringify(user));
        localStorage.setItem('isra_auth_token', 'mock-token-' + user.id);
        
        toast.success('Connexion réussie');
        navigate('/dashboard');
      } else {
        const errorMessage = !user 
          ? 'Email non trouvé dans le système' 
          : 'Mot de passe incorrect';
        
        setErrors([{ field: 'general', message: errorMessage }]);
        toast.error('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setErrors([{ field: 'general', message: 'Erreur technique. Veuillez réessayer.' }]);
      toast.error('Erreur technique');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: keyof LoginFormData): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const getGeneralError = (): string | undefined => {
    return errors.find(error => error.field === 'general')?.message;
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
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {getGeneralError() && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {getGeneralError()}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@isra.sn"
              required
              value={formData.email}
              onChange={handleInputChange('email')}
              className={getFieldError('email') ? 'border-red-500 focus:border-red-500' : ''}
              disabled={isLoading}
            />
            {getFieldError('email') && (
              <p className="text-sm text-red-600">{getFieldError('email')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <button 
                type="button"
                className="text-sm text-isra-green hover:underline focus:outline-none"
                onClick={() => toast.info('Fonctionnalité bientôt disponible')}
              >
                Mot de passe oublié?
              </button>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange('password')}
              className={getFieldError('password') ? 'border-red-500 focus:border-red-500' : ''}
              disabled={isLoading}
            />
            {getFieldError('password') && (
              <p className="text-sm text-red-600">{getFieldError('password')}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-isra-green hover:bg-isra-green-dark"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <div className="text-sm text-gray-500 text-center">
          <p className="mb-2">Pour les tests, utilisez un des emails suivants :</p>
          <div className="space-y-1">
            <p className="font-medium">adiop@isra.sn • fsy@isra.sn • mkane@isra.sn</p>
            <p className="text-xs">Mot de passe: <span className="font-mono">12345</span></p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
