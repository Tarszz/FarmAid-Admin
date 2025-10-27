
export type Complaint = {
  id: string;
  userId: string;
  userName: string;
  userType: string;
  issueType: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  message: string;
  date: string;
  email: string;
  phone: string;
  responseHistory?: {
    adminId: string;
    adminName: string;
    response: string;
    date: string;
  }[];
};
