
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const seedLotSchema = z.object({
  lotNumber: z.string().min(1, { message: "Le numéro de lot est requis" }),
  variety: z.string().min(1, { message: "La variété est requise" }),
  species: z.string().min(1, { message: "L'espèce est requise" }),
  generation: z.string().min(1, { message: "La génération est requise" }),
  quantity: z.string().min(1, { message: "La quantité est requise" }),
  harvestDate: z.string().min(1, { message: "La date de récolte est requise" }),
  notes: z.string().optional(),
});

export default function SeedLotAdd() {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof seedLotSchema>>({
    resolver: zodResolver(seedLotSchema),
    defaultValues: {
      lotNumber: "",
      variety: "",
      species: "",
      generation: "",
      quantity: "",
      harvestDate: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof seedLotSchema>) {
    console.log(values);
    toast.success("Lot de semences ajouté avec succès");
    navigate("/seed-lots");
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Link to="/seed-lots">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-isra-green">Ajouter un lot de semences</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations du lot</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="lotNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de lot</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: SL-G2-RIZ-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="variety"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variété</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Sahel 108" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Espèce</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une espèce" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="riz">Riz</SelectItem>
                                <SelectItem value="mais">Maïs</SelectItem>
                                <SelectItem value="arachide">Arachide</SelectItem>
                                <SelectItem value="mil">Mil</SelectItem>
                                <SelectItem value="sorgho">Sorgho</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="generation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Génération</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une génération" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="G0">G0 (Breeder)</SelectItem>
                                <SelectItem value="G1">G1 (Foundation)</SelectItem>
                                <SelectItem value="G2">G2 (Registered)</SelectItem>
                                <SelectItem value="G3">G3 (Certified)</SelectItem>
                                <SelectItem value="G4">G4 (Commercial)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantité (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="harvestDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de récolte</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informations complémentaires sur le lot..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Link to="/seed-lots">
                      <Button variant="outline">Annuler</Button>
                    </Link>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
