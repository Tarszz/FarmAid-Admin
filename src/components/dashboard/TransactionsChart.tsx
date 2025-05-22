
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarRange, Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TransactionsChartProps = {
  data: Array<{
    name: string;
    transactions: number;
    donations: number;
  }>;
  timeRange: string;
  setTimeRange: (range: string) => void;
};

const TransactionsChart: React.FC<TransactionsChartProps> = ({ 
  data, 
  timeRange, 
  setTimeRange 
}) => {
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-admin-text">Transactions & Donations Overview</h2>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-admin-textSecondary hover:text-admin-text text-sm font-medium px-3 py-1.5 rounded-md border border-admin-border hover:border-admin-secondary transition-colors">
                <CalendarRange size={16} className="mr-2" />
                <span>{timeRange}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange('Last 30 days')}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('Last 90 days')}>
                Last 90 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('Last 6 months')}>
                Last 6 months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('Last 12 months')}>
                Last 12 months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('Year to date')}>
                Year to date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-admin-textSecondary hover:text-admin-text rounded-md border border-admin-border hover:border-admin-secondary transition-colors">
                <Filter size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                All Transactions
              </DropdownMenuItem>
              <DropdownMenuItem>
                Purchases Only
              </DropdownMenuItem>
              <DropdownMenuItem>
                Sales Only
              </DropdownMenuItem>
              <DropdownMenuItem>
                Donations Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barGap={10}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EDF5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₱${value}`} />
            <Tooltip 
              formatter={(value) => [`₱${value}`, 'Amount']}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #E9EDF5',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }} 
            />
            <Bar dataKey="transactions" name="Transactions" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="donations" name="Donations" fill="#34445C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionsChart;
