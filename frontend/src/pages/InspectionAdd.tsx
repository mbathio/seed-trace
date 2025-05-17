
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";

// Données fictives pour les lots de semences
const mockSeedLots = [
  { id: "SL-G2-RIZ-001", variety: "SAHEL 108" },
  { id: "SL-G2-RIZ-003", variety: "SAHEL 201" },
  { id: "SL-G2-RIZ-007", variety: "NERICA L-19" },
  { id: "SL-G2-RIZ-009", variety: "IR 64" },
  { id: "SL-G2-RIZ-012", variety: "ORYLUX 6" }
];

// Données fictives pour les multiplicateurs
const mockMultipliers = [
  { name: "Abdou Diop", location: "Dagana" },
  { name: "Fatou Ndiaye", location: "Richard Toll" },
  { name: "Modou Gueye", location: "Ross Béthio" },
  { name: "Aminata Diagne", location: "Podor" },
  { name: "Ousmane Fall", location: "Matam" }
];

// Données fictives pour les inspecteurs
const mockInspectors = [
  "Moussa Sow",
  "Aissatou Fall",
  "Ibrahima Diallo"
];

// Interface pour le formulaire d'inspection
interface InspectionFormValues {
  date: Date;
  seedLotCode: string;
  multiplier: string;
  location: string;
  status: string;
  inspector: string;
}

export default function InspectionAdd() {
  const navigate = useNavigate();
  const [locationValue, setLocationValue] = useState<string>("");
  
  // Initialisation du formulaire
  const form = useForm<InspectionFormValues>({
    defaultValues: {
      date: new Date(),
      seedLotCode: "",
      multiplier: "",
      location: "",
      status: "planifiée",
      inspector: ""
    }
  });

  // Fonction pour gérer la soumission du formulaire
  const onSubmit = (data: InspectionFormValues) => {
    console.log('Inspection créée:', data);
    
    // Afficher un message de confirmation
    toast.success("Nouvelle inspection créée avec succès");
    
    // Rediriger vers la liste des inspections
    navigate('/inspections');
  };

  // Fonction pour gérer la sélection d'un multiplicateur
  const handleMultiplierSelect = (multiplierName: string) => {
    const selectedMultiplier = mockMultipliers.find(m => m.name === multiplierName);
    if (selectedMultiplier) {
      form.setValue("multiplier", selectedMultiplier.name);
      form.setValue("location", selectedMultiplier.location);
      setLocationValue(selectedMultiplier.location);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-isra-green">Ajouter une inspection</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date d'inspection</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("2025-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="seedLotCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lot de semences</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un lot de semences" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSeedLots.map((lot) => (
                              <SelectItem key={lot.id} value={lot.id}>
                                {lot.id} - {lot.variety}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="multiplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Multiplicateur</FormLabel>
                        <Select 
                          onValueChange={(value) => handleMultiplierSelect(value)} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un multiplicateur" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockMultipliers.map((multi) => (
                              <SelectItem key={multi.name} value={multi.name}>
                                {multi.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu</FormLabel>
                      <FormControl>
                        <Input {...field} value={locationValue || field.value} readOnly />
                      </FormControl>
                      <FormDescription>
                        Le lieu est automatiquement rempli en fonction du multiplicateur sélectionné.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planifiée">Planifiée</SelectItem>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="complétée">Complétée</SelectItem>
                            <SelectItem value="annulée">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspecteur</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un inspecteur" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockInspectors.map((inspector) => (
                              <SelectItem key={inspector} value={inspector}>
                                {inspector}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/inspections')}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-isra-green hover:bg-isra-green/90">
                    Créer l'inspection
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
