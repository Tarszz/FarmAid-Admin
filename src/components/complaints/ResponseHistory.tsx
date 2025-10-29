
import React from 'react';

interface ResponseHistoryProps {
  responseHistory: {
    adminId: string;
    adminName: string;
    response: string;
    date: string;
  }[];
}

const ResponseHistory: React.FC<ResponseHistoryProps> = ({ responseHistory }) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-sm mb-2">Response History</h3>
      <div className="space-y-2">
        {responseHistory.map((response, index) => (
          <div key={index} className="bg-white p-3 rounded-md text-sm border border-admin-border">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{response.adminName}</span>
              <span className="text-xs text-admin-textSecondary">{response.date}</span>
            </div>
            <p>{response.response}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseHistory;
