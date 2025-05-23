
import React, { useState } from 'react';
import { Complaint } from '@/types/complaint';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import ResponseHistory from './ResponseHistory';
import ResponseForm from './ResponseForm';

interface ComplaintDetailsProps {
  complaint: Complaint;
  handleStatusChange: (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => void;
  submitResponse: (id: string, response: string) => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaint,
  handleStatusChange,
  submitResponse
}) => {
  const [adminResponse, setAdminResponse] = useState('');

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-sm mb-2">User Information</h3>
          <p className="text-sm mb-1"><span className="font-medium">Name:</span> {complaint.userName}</p>
          <p className="text-sm mb-1"><span className="font-medium">Type:</span> {complaint.userType}</p>
          <p className="text-sm mb-1"><span className="font-medium">Email:</span> {complaint.email}</p>
          <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {complaint.phone}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-2">Complaint Details</h3>
          <p className="text-sm mb-1"><span className="font-medium">Issue Type:</span> {complaint.issueType}</p>
          <p className="text-sm mb-1"><span className="font-medium">Date:</span> {complaint.date}</p>
          <p className="text-sm mb-1"><span className="font-medium">Status:</span> {complaint.status}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2">Complaint Message</h3>
        <div className="bg-white p-3 rounded-md text-sm border border-admin-border">
          {complaint.message}
        </div>
      </div>
      
      {complaint.responseHistory && complaint.responseHistory.length > 0 && (
        <ResponseHistory responseHistory={complaint.responseHistory} />
      )}
      
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleStatusChange(complaint.id, 'Open')}
            disabled={complaint.status === 'Open'}
          >
            Mark as Open
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleStatusChange(complaint.id, 'In Progress')}
            disabled={complaint.status === 'In Progress'}
          >
            Mark as In Progress
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleStatusChange(complaint.id, 'Resolved')}
            disabled={complaint.status === 'Resolved'}
          >
            <CheckCircle2 size={16} className="mr-1" />
            Resolve Complaint
          </Button>
        </div>
        
        {complaint.status !== 'Resolved' && (
          <ResponseForm 
            complaintId={complaint.id}
            adminResponse={adminResponse}
            setAdminResponse={setAdminResponse}
            submitResponse={() => {
              submitResponse(complaint.id, adminResponse);
              setAdminResponse('');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
