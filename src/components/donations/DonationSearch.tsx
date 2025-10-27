
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DonationSearchProps {
  searchTerm: string;
  onChange: (value: string) => void;
}

const DonationSearch: React.FC<DonationSearchProps> = ({ searchTerm, onChange }) => {
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
      <Input
        type="search"
        placeholder="Search donations..."
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 w-full"
      />
    </div>
  );
};

export default DonationSearch;
