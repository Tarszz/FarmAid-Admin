
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type Approval = {
  id: number;
  name: string;
  type: string;
  dateApplied: string;
  status: string;
};

type PendingApprovalsProps = {
  approvals: Approval[];
};

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ approvals }) => {
  const { toast } = useToast();

  const handleApprove = (approval: Approval) => {
    toast({
      title: "User Approved",
      description: `${approval.name} has been approved successfully.`,
    });
  };

  const handleReject = (approval: Approval) => {
    toast({
      title: "User Rejected",
      description: `${approval.name} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="admin-card animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-amber-50 rounded-lg mr-3">
            <Users size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-admin-text">Pending Approvals</h2>
            <p className="text-sm text-admin-textSecondary">Users waiting for verification</p>
          </div>
        </div>
        <Button
          className="flex items-center text-sm text-admin-secondary hover:text-admin-primary transition-colors font-medium"
          variant="ghost"
          asChild
        >
          <Link to="/approvals">
            View All <ArrowUpRight size={16} className="ml-1" />
          </Link>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-admin-border">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Date Applied</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-admin-border">
            {approvals.map((approval) => (
              <tr key={approval.id} className="hover:bg-admin-background/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-admin-text">{approval.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-admin-secondary/10 text-admin-secondary">
                    <Tag size={12} className="mr-1" />
                    {approval.type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-admin-textSecondary">{approval.dateApplied}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    approval.status === 'pending' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {approval.status === 'pending' ? 'Pending' : 'Under Review'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    className="text-admin-secondary hover:text-admin-primary transition-colors mr-2"
                    variant="ghost"
                    onClick={() => handleApprove(approval)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="text-admin-danger hover:text-admin-danger/80 transition-colors"
                    variant="ghost"
                    onClick={() => handleReject(approval)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovals;
