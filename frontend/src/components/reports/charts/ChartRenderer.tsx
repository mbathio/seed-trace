
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ChartRendererProps {
  data: any[];
  chartType: string;
  dataKey: string;
  yAxisLabel: string;
}

const ChartRenderer = ({ data, chartType, dataKey, yAxisLabel }: ChartRendererProps) => {
  if (data.length === 0) {
    return <p className="text-center py-10 text-gray-500">Aucune donnée disponible pour ce rapport</p>;
  }
  
  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" name={yAxisLabel} />
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" name={yAxisLabel} />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => dataKey === 'passRate' ? `${Number(value).toFixed(1)}%` : value} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    
    default:
      return null;
  }
};

export default ChartRenderer;
