
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

const distributionSchema = z.object({
  seedLot: z.string().min(1, { message: "Le lot de semences est requis" }),
  receiver: z.string().min(1, { message: "Le destinataire est requis" }),
  quantity: z.string().min(1, { message: "La quantité est requise" }),
  date: z.string().min(1, { message: "La date est requise" }),
  status: z.string().min(1, { message: "Le statut est requis" }),
  notes: z.string().optional(),
});

// Lots fictifs de semences
const seedLots = [
  { id: "SL-G2-RIZ-001", name: "SL-G2-RIZ-001 - Sahel 108" },
  { id: "SL-G2-RIZ-003", name: "SL-G2-RIZ-003 - Sahel 134" },
  { id: "SL-G2-RIZ-007", name: "SL-G2-RIZ-007 - Sahel 177" },
  { id: "SL-G2-RIZ-009", name: "SL-G2-RIZ-009 - NERICA L-19" },
  { id: "SL-G2-RIZ-012", name: "SL-G2-RIZ-012 - ISRIZ 4" },
];

// Destinataires fictifs
const receivers = [
  { id: "DEST001", name: "Coopérative Dagana" },
  { id: "DEST002", name: "GIE Podor" },
  { id: "DEST003", name: "Ferme Matam" },
  { id: "DEST004", name: "Projet PAPSEN" },
  { id: "DEST005", name: "Union des Producteurs" },
];

export default function DistributionAdd() {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof distributionSchema>>({
    resolver: zodResolver(distributionSchema),
    defaultValues: {
      seedLot: "",
      receiver: "",
      quantity: "",
      date: "",
      status: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof distributionSchema>) {
    console.log(values);
    toast.success("Distribution ajoutée avec succès");
    navigate("/distributions");
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Link to="/distributions">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-isra-green">Ajouter une distribution</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations de la distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="seedLot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lot de semences</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un lot" />
                              </SelectTrigger>
                              <SelectContent>
                                {seedLots.map((lot) => (
                                  <SelectItem key={lot.id} value={lot.id}>{lot.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="receiver"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destinataire</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un destinataire" />
                              </SelectTrigger>
                              <SelectContent>
                                {receivers.map((receiver) => (
                                  <SelectItem key={receiver.id} value={receiver.id}>{receiver.name}</SelectItem>
                                ))}
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
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de distribution</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statut</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planifiée">Planifiée</SelectItem>
                                <SelectItem value="en_cours">En cours</SelectItem>
                                <SelectItem value="livrée">Livrée</SelectItem>
                                <SelectItem value="annulée">Annulée</SelectItem>
                              </SelectContent>
                            </Select>
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
                            placeholder="Informations complémentaires sur la distribution..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Link to="/distributions">
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
