
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChartRenderer from './charts/ChartRenderer';
import DataTable from './tables/DataTable';

interface ReportCardProps {
  reportType: string;
  data: any[];
  dataKey: string;
  yAxisLabel: string;
  chartType: string;
}

const ReportCard = ({ reportType, data, dataKey, yAxisLabel, chartType }: ReportCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {reportType === 'production' && "Analyse de la production par variété"}
          {reportType === 'quality' && "Analyse de la qualité par niveau de semence"}
          {reportType === 'yield' && "Analyse du rendement par niveau de semence"}
        </CardTitle>
        <CardDescription>
          {reportType === 'production' && "Quantités produites par variété de semence"}
          {reportType === 'quality' && "Taux de réussite aux tests de qualité par niveau"}
          {reportType === 'yield' && "Rendements moyens par niveau de semence"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ChartRenderer 
            data={data} 
            chartType={chartType} 
            dataKey={dataKey} 
            yAxisLabel={yAxisLabel} 
          />
        </div>
        
        <div className="overflow-x-auto">
          <DataTable data={data} reportType={reportType} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
