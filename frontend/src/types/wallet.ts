export interface WalletState {
  isConnected: boolean;
  address: string | null;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  description: string;
  transactionId: string;
}