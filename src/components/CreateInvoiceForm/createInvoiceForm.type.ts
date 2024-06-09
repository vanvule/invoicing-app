export interface Validation {
  required: boolean;
  message: string;
  min?: number;
}

export interface FormField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'dateTime' | 'SingleSelect';
  options?: string[];
  validation?: Validation;
}

export interface TableItem {
  id: string;
  label: string;
  type: 'number' | 'text';
  validation?: Validation;
}

export interface FormData {
  formFields: FormField[];
  tableItems: TableItem[];
}

export interface Item {
  details: string;
  quantity: number;
  price: number;
  amount: number;
}