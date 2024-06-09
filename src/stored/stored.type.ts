export interface InvoiceItem {
  details: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface Invoice {
  id?: number;
  documentNumber: number;
  documentType: string;
  prepared: string;
  contractor: string;
  format: string;
  bankAccount: string;
  invoiceDate: Record<string, any>;
  dueDate: Record<string, any>;
  payment: string;
  items: InvoiceItem[];
  total: number;
  status: 'Draft' | 'Paid' | 'Not Paid' | 'Inprogress';
  note: string;
}