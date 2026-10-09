import { NotificationItem } from '../types';

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'PM SVANidhi Status Changed',
    body: 'Your loan application SVN-2026-781903 has moved from "Submitted" to "Under Verification by Lending Bank".',
    schemeName: 'PM SVANidhi',
    applicationId: 'app-demo-svanidhi-02',
    type: 'status_changed',
    read: false,
    timestamp: '2 hours ago',
  },
  {
    id: 'notif-2',
    title: 'Payment Processing Update',
    body: 'Your PM-KISAN installment payment status has updated to "Fund Transfer Order (FTO) processing". Payment will be credited shortly.',
    schemeName: 'PM-KISAN',
    applicationId: 'app-demo-pmkisan-01',
    type: 'payment',
    read: false,
    timestamp: '5 hours ago',
  },
  {
    id: 'notif-3',
    title: 'Action Needed: Document Requested',
    body: 'PM Vishwakarma review panel requested a clear copy of your bank passbook with IFSC code. Click here to check next steps.',
    schemeName: 'PM Vishwakarma',
    applicationId: 'app-demo-vishwakarma-03',
    type: 'doc_required',
    read: false,
    timestamp: '1 day ago',
  },
  {
    id: 'notif-4',
    title: 'Application Deadline Reminder',
    body: 'National Scholarship Portal applications for Academic Year 2026-27 will close in 23 days. Check your bonafide certificate.',
    schemeName: 'National Scholarship Portal',
    type: 'deadline',
    read: true,
    timestamp: '2 days ago',
  },
];
