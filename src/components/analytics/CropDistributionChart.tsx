
import React from 'react';
import { 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip, 
  Cell,
  Legend
} from 'recharts';

interface CropDistributionChartProps {
  data: Array<{ name: string; value: number }>;
}

const CropDistributionChart: React.FC<CropDistributionChartProps> = ({ data }) => {
  const COLORS = ['#0DA54B', '#34445C', '#4ECDC4', '#FF6B6B', '#FFE66D'];

  return (
    <div className="h-[320px] w-full flex flex-col">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} Kg`, 'Quantity']} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ 
              paddingTop: "10px",
              width: "100%",
              bottom: 0
            }}
            formatter={(value, entry, index) => {
              const item = data[index];
              return (
                <span className="text-xs md:text-sm px-2">
                  {value}: {item.value} Kg
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropDistributionChart;
