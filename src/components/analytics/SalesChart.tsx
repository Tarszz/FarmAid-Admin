
import React from 'react';
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Bar 
} from 'recharts';

interface SalesChartProps {
  data: Array<{ month: string; value: number }>;
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `₱${value/1000}k`} />
          <Tooltip formatter={(value) => [`₱${value}`, 'Sales']} />
          <Bar dataKey="value" fill="#0DA54B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
