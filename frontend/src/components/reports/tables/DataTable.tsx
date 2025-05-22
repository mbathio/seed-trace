
import React from 'react';

interface DataTableProps {
  data: any[];
  reportType: string;
}

const DataTable = ({ data, reportType }: DataTableProps) => {
  if (data.length === 0) {
    return null;
  }
  
  switch (reportType) {
    case 'production':
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Variété</th>
              <th className="text-right py-3 px-4">Quantité (kg)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4">{item.name}</td>
                <td className="text-right py-2 px-4">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    
    case 'quality':
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Niveau</th>
              <th className="text-right py-3 px-4">Taux de réussite</th>
              <th className="text-right py-3 px-4">Tests réussis</th>
              <th className="text-right py-3 px-4">Tests échoués</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4">{item.name}</td>
                <td className="text-right py-2 px-4">{item.passRate.toFixed(1)}%</td>
                <td className="text-right py-2 px-4">{item.passCount}</td>
                <td className="text-right py-2 px-4">{item.failCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    
    case 'yield':
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Niveau</th>
              <th className="text-right py-3 px-4">Rendement moyen (kg)</th>
              <th className="text-right py-3 px-4">Nombre de productions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4">{item.name}</td>
                <td className="text-right py-2 px-4">{item.averageYield.toFixed(1)}</td>
                <td className="text-right py-2 px-4">{item.productionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    
    default:
      return null;
  }
};

export default DataTable;
