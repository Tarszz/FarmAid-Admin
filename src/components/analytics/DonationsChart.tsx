
import React from 'react';
import { 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line 
} from 'recharts';

interface DonationsChartProps {
  data: Array<{ month: string; value: number; families: number }>;
}

const DonationsChart: React.FC<DonationsChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `₱${value/1000}k`} />
          <Tooltip formatter={(value) => [`₱${value}`, 'Donations']} />
          <Line type="monotone" dataKey="value" stroke="#0DA54B" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationsChart;
