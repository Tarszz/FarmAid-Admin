
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DeliverySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string | null;
  onFilterChange: (status: string | null) => void;
}

const DeliverySearch: React.FC<DeliverySearchProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
        <Input
          type="search"
          placeholder="Search deliveries..."
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
              Status
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterChange(null)}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('In Progress')}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('Delivered')}>
              Delivered
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DeliverySearch;
