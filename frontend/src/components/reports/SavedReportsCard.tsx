
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SavedReportsList from './saved-reports/SavedReportsList';
import { Report } from '@/utils/seedTypes';

interface SavedReportsCardProps {
  reports: Report[];
}

const SavedReportsCard = ({ reports }: SavedReportsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapports enregistrés</CardTitle>
        <CardDescription>Rapports précédemment générés et enregistrés</CardDescription>
      </CardHeader>
      <CardContent>
        <SavedReportsList reports={reports} />
      </CardContent>
    </Card>
  );
};

export default SavedReportsCard;
