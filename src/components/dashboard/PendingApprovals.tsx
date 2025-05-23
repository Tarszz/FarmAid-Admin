import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

import { db } from '../../../firebase'; 

type User = {
  id: string;
  firstname: string;
  lastname: string;
  userType: string;
  createdAt: Timestamp;
  status: string;
};

const PendingApprovals: React.FC = () => {
  const [approvals, setApprovals] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('status', '==', 'Pending'));
        const querySnapshot = await getDocs(q);

        const users: User[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            firstname: data.firstname,
            lastname: data.lastname,
            userType: data.userType,
            createdAt: data.dateJoined,
            status: data.status,
          };
        });

        setApprovals(users);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    };

    fetchPendingUsers();
  }, []);

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
            {approvals.map((user) => (
              <tr key={user.id} className="hover:bg-admin-background/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-admin-text">{user.firstname} {user.lastname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-admin-secondary/10 text-admin-secondary">
                    <Tag size={12} className="mr-1" />
                    {user.userType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-admin-textSecondary">
                    {user.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    className="text-admin-secondary hover:text-admin-primary transition-colors"
                    variant="ghost"
                    onClick={() => navigate(`/users`)}
                  >
                    Verify
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
