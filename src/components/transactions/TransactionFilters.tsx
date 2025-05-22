
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (type: string | null) => void;
  onStatusFilterChange: (status: string | null) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onTypeFilterChange,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
        <Input
          type="search"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4 mr-1" />
              Type
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onTypeFilterChange(null)}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTypeFilterChange('Donation')}>
              Donations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTypeFilterChange('Sold to Market')}>
              Market Sales
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4 mr-1" />
              Status
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusFilterChange(null)}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange('Completed')}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange('Pending')}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange('Cancelled')}>
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TransactionFilters;
