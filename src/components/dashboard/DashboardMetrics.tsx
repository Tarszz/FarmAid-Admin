import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Users, FileCheck, ShoppingCart, HandHeart } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase'; // your firestore export
import { cn } from '@/lib/utils';

type Metric = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  bgColor: string;
};

const DashboardMetrics = () => {
  const [metricsData, setMetricsData] = useState<Metric[]>([
    {
      title: 'Total Users',
      value: '...',
      change: 0,
      icon: <Users size={24} className="text-indigo-500" />,
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Pending Approvals',
      value: '...',
      change: 0,
      icon: <FileCheck size={24} className="text-amber-500" />,
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Transactions',
      value: '₱...',
      change: 0,
      icon: <ShoppingCart size={24} className="text-emerald-500" />,
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Donations',
      value: '...',
      change: 0,
      icon: <HandHeart size={24} className="text-rose-500" />,
      bgColor: 'bg-rose-50'
    }
  ]);

  useEffect(() => {
    // Reference Firestore collections
    const usersCol = collection(db, 'users');
    const transactionsCol = collection(db, 'transactions');

    // Listen to users collection
    const unsubscribeUsers = onSnapshot(usersCol, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data());
      const totalUsers = users.length;
      const pendingApprovals = users.filter(user => user.status === 'Pending').length;

      setMetricsData(prev => [
        { ...prev[0], value: `${totalUsers}` },
        { ...prev[1], value: `${pendingApprovals}` },
        prev[2],
        prev[3],
      ]);
    });

    // Listen to transactions collection
    const unsubscribeTransactions = onSnapshot(transactionsCol, (snapshot) => {
      const transactions = snapshot.docs.map(doc => doc.data());
      let totalPurchases = 0;
      let totalDonations = 0;

      transactions.forEach(txn => {
        if (txn.transactionType === 'purchase') {
          totalPurchases += Number(txn.totalAmount || 0);
        } else if (txn.transactionType === 'donation') {
          totalDonations += Number(txn.totalAmount || 0);
        }
      });

      setMetricsData(prev => [
        prev[0],
        prev[1],
        { ...prev[2], value: `₱${totalPurchases.toLocaleString()}` },
        { ...prev[3], value: `₱${totalDonations.toLocaleString()}` }
      ]);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeTransactions();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
      {metricsData.map((metric, idx) => (
        <div
          key={idx}
          className="admin-card p-6 hover:translate-y-[-4px] transition-all duration-300 border border-admin-border rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-admin-textSecondary text-sm font-medium mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold text-admin-text">{metric.value}</h3>
            </div>
            <div className={cn("p-3 rounded-lg", metric.bgColor)}>
              {metric.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
