import React from 'react';
import { Descriptions } from 'antd';
import dayjs from 'dayjs';
import { Invoice } from '../../stored/stored.type'; 

export const renderInvoiceBody = (invoice: Invoice | null) => {

  if (!invoice) {
    return null;
  }

  const keys = Object.keys(invoice);

  return (
    <Descriptions column={1}>
      {keys.map((key, index) => {
        let label = '';
        let content: React.ReactNode = '';

        switch (key) {
          case 'documentType':
            label = 'Document Type';
            content = invoice[key];
            break;
          case 'prepared':
            label = 'Prepared';
            content = invoice[key];
            break;
          case 'contractor':
            label = 'Contractor';
            content = invoice[key];
            break;
          case 'format':
            label = 'Format';
            content = invoice[key];
            break;
          case 'bankAccount':
            label = 'Bank Account';
            content = invoice[key];
            break;
          case 'note':
            label = 'Note';
            content = invoice[key];
            break;
          case 'invoiceDate':
            label = 'Invoice Date';
            content = dayjs(invoice[key].$d).format('DD/MM/YYYY');
            break;
          case 'dueDate':
            label = 'Due Date';
            content = dayjs(invoice[key].$d).format('DD/MM/YYYY');
            break;
          case 'payment':
            label = 'Payment';
            content = invoice[key];
            break;
          case 'status':
            label = 'Status';
            content = invoice[key];
            break;
          case 'items':
            label = 'Items';
            content = invoice[key].map((item, idx) => (
              <div key={idx}>
                <p>Details: {item.details}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price}</p>
                <p>Amount: {item.amount}</p>
              </div>
            ));
            break;
          default:
            return null;
        }

        return (
          <Descriptions.Item key={index} label={label}>
            {content}
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  );
};
