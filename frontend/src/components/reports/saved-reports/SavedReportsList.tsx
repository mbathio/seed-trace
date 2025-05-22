
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Report } from '@/utils/seedTypes';

interface SavedReportsListProps {
  reports: Report[];
}

const SavedReportsList = ({ reports }: SavedReportsListProps) => {
  return (
    <Tabs defaultValue="production">
      <TabsList>
        <TabsTrigger value="production">Production</TabsTrigger>
        <TabsTrigger value="quality">Qualité</TabsTrigger>
        <TabsTrigger value="inventory">Inventaire</TabsTrigger>
        <TabsTrigger value="custom">Personnalisés</TabsTrigger>
      </TabsList>
      
      <TabsContent value="production" className="mt-4">
        <div className="space-y-3">
          {reports.filter(report => report.type === 'production').map(report => (
            <Card key={report.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-500">
                      Créé le {new Date(report.creationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Voir</Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="quality" className="mt-4">
        <div className="space-y-3">
          {reports.filter(report => report.type === 'quality').map(report => (
            <Card key={report.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-500">
                      Créé le {new Date(report.creationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Voir</Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="inventory" className="mt-4">
        <div className="text-center py-6 text-gray-500">
          Aucun rapport d'inventaire enregistré
        </div>
      </TabsContent>
      
      <TabsContent value="custom" className="mt-4">
        <div className="space-y-3">
          {reports.filter(report => report.type === 'multiplier_performance' || report.type === 'custom').map(report => (
            <Card key={report.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-500">
                      Créé le {new Date(report.creationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Voir</Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SavedReportsList;
