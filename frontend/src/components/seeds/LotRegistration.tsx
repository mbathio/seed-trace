
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MOCK_VARIETIES, SeedLevel } from '@/utils/seedTypes';

const LotRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    varietyId: '',
    level: '' as SeedLevel,
    quantity: '',
    parentLotId: '',
    productionDate: '',
    parcelLocation: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    if (!formData.varietyId || !formData.level || !formData.quantity || !formData.productionDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      setIsLoading(false);
      return;
    }

    // Generate a lot ID based on level and date
    const today = new Date();
    const year = today.getFullYear();
    const lotId = `SL-${formData.level}-${year}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Simulate API call to register the lot
    setTimeout(() => {
      // In a real app, we would send the data to a server
      toast.success(`Lot ${lotId} enregistré avec succès`);
      setIsLoading(false);
      navigate('/lots');
    }, 1500);
  };

  const seedLevels: { value: SeedLevel; label: string }[] = [
    { value: 'GO', label: 'GO - Pré-base' },
    { value: 'G1', label: 'G1 - Base première génération' },
    { value: 'G2', label: 'G2 - Base deuxième génération' },
    { value: 'G3', label: 'G3 - Certifiée première reproduction' },
    { value: 'R1', label: 'R1 - Certifiée première reproduction' },
    { value: 'R2', label: 'R2 - Certifiée deuxième reproduction' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-isra-green-dark">Enregistrement d'un nouveau lot</CardTitle>
        <CardDescription>
          Saisissez les informations du nouveau lot de semences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="varietyId">Variété *</Label>
              <Select 
                name="varietyId" 
                value={formData.varietyId}
                onValueChange={(value) => handleSelectChange('varietyId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une variété" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_VARIETIES.map(variety => (
                    <SelectItem key={variety.id} value={variety.id.toString()}>
                      {variety.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Niveau de semence *</Label>
              <Select 
                name="level" 
                value={formData.level}
                onValueChange={(value) => handleSelectChange('level', value as SeedLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {seedLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité (kg) *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 50.5"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productionDate">Date de production *</Label>
              <Input
                id="productionDate"
                name="productionDate"
                type="date"
                value={formData.productionDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentLotId">ID du lot parent</Label>
              <Input
                id="parentLotId"
                name="parentLotId"
                placeholder="Ex: SL-GO-2023-001"
                value={formData.parentLotId}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">Obligatoire pour les niveaux G1 à R2</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parcelLocation">Localisation de la parcelle</Label>
              <Input
                id="parcelLocation"
                name="parcelLocation"
                placeholder="Ex: 16.0321,-16.4857"
                value={formData.parcelLocation}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes et observations</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Informations complémentaires sur le lot..."
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/lots')}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button 
          className="bg-isra-green hover:bg-isra-green-dark"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer le lot'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LotRegistration;
