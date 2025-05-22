
import { useState } from 'react';
import { MOCK_REPORTS } from '@/utils/seedTypes';
import ReportControls from './controls/ReportControls';
import ReportCard from './ReportCard';
import SavedReportsCard from './SavedReportsCard';
import { productionData, qualityData, yieldData } from './data/ReportDataHelpers';

const AdvancedAnalytics = () => {
  const [period, setPeriod] = useState<string>('year');
  const [reportType, setReportType] = useState<string>('production');
  const [chartType, setChartType] = useState<string>('bar');
  
  // Select data based on report type
  const getReportData = () => {
    switch (reportType) {
      case 'production':
        return productionData();
      case 'quality':
        return qualityData();
      case 'yield':
        return yieldData();
      default:
        return [];
    }
  };
  
  // Get appropriate y-axis label based on report type
  const getYAxisLabel = () => {
    switch (reportType) {
      case 'production':
        return 'Quantité (kg)';
      case 'quality':
        return 'Taux de réussite (%)';
      case 'yield':
        return 'Rendement moyen (kg)';
      default:
        return '';
    }
  };
  
  // Get appropriate data key based on report type
  const getDataKey = () => {
    switch (reportType) {
      case 'production':
        return 'quantity';
      case 'quality':
        return 'passRate';
      case 'yield':
        return 'averageYield';
      default:
        return '';
    }
  };

  const data = getReportData();
  const yAxisLabel = getYAxisLabel();
  const dataKey = getDataKey();

  return (
    <div className="space-y-6">
      <ReportControls
        reportType={reportType}
        period={period}
        chartType={chartType}
        onReportTypeChange={setReportType}
        onPeriodChange={setPeriod}
        onChartTypeChange={setChartType}
      />
      
      <ReportCard
        reportType={reportType}
        data={data}
        dataKey={dataKey}
        yAxisLabel={yAxisLabel}
        chartType={chartType}
      />
      
      <SavedReportsCard reports={MOCK_REPORTS} />
    </div>
  );
};

export default AdvancedAnalytics;
