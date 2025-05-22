
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Filter, Share2, Download } from 'lucide-react';

interface ReportControlsProps {
  reportType: string;
  period: string;
  chartType: string;
  onReportTypeChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onChartTypeChange: (value: string) => void;
}

const ReportControls = ({
  reportType,
  period,
  chartType,
  onReportTypeChange,
  onPeriodChange,
  onChartTypeChange
}: ReportControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={reportType} onValueChange={onReportTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de rapport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="quality">Qualité</SelectItem>
            <SelectItem value="yield">Rendement</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Mois en cours</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
            <SelectItem value="year">Année</SelectItem>
            <SelectItem value="all">Toutes les données</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres avancés
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Select value={chartType} onValueChange={onChartTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de graphique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Barres</SelectItem>
            <SelectItem value="line">Ligne</SelectItem>
            <SelectItem value="pie">Circulaire</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
        
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>
    </div>
  );
};

export default ReportControls;
