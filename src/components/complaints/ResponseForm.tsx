
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ResponseFormProps {
  complaintId: string;
  adminResponse: string;
  setAdminResponse: (value: string) => void;
  submitResponse: () => void;
}

const ResponseForm: React.FC<ResponseFormProps> = ({
  complaintId,
  adminResponse,
  setAdminResponse,
  submitResponse
}) => {
  return (
    <div className="mt-3">
      <h3 className="font-semibold text-sm mb-2">Add Response</h3>
      <div className="flex gap-2">
        <textarea
          className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Type your response here..."
          value={adminResponse}
          onChange={(e) => setAdminResponse(e.target.value)}
        />
      </div>
      <Button 
        className="mt-2"
        size="sm"
        onClick={submitResponse}
        disabled={!adminResponse.trim()}
      >
        <MessageCircle size={16} className="mr-1" />
        Send Response
      </Button>
    </div>
  );
};

export default ResponseForm;
