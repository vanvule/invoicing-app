import { dbName, storeName } from "./stored.constant";
import { Invoice } from "./stored.type";

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('documentNumber', 'documentNumber', { unique: false });
      objectStore.createIndex('date', 'date', { unique: false });
      objectStore.createIndex('total', 'total', { unique: false });
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject(`Database error: ${(event.target as IDBOpenDBRequest).error}`);
    };
  });
};

const addInvoice = (invoice: Invoice): Promise<string> => {
  return openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.add(invoice);

      request.onsuccess = () => {
        resolve('Invoice added successfully');
      };

      request.onerror = () => {
        reject('Error adding invoice');
      };
    });
  });
};

const getInvoices = (): Promise<Invoice[]> => {
  return openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result as Invoice[]);
      };

      request.onerror = () => {
        reject('Error getting invoices');
      };
    });
  });
};

const getInvoiceById = (id: number): Promise<Invoice> => {
  return openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result as Invoice);
      };

      request.onerror = () => {
        reject(`Error getting invoice with id ${id}`);
      };
    });
  });
};

const deleteInvoiceById = (id: number): Promise<string> => {
  return openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve(`Invoice with id ${id} deleted successfully`);
      };

      request.onerror = () => {
        reject(`Error deleting invoice with id ${id}`);
      };
    });
  });
};

const deleteAllInvoices = (): Promise<string> => {
  return openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve('All invoices deleted successfully');
      };

      request.onerror = () => {
        reject('Error deleting all invoices');
      };
    });
  });
};

const updateInvoiceById = (id: number, updatedInvoice: Partial<Invoice>): Promise<string> => {
  return openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        const invoice = request.result as Invoice;
        Object.assign(invoice, updatedInvoice);
        const updateRequest = objectStore.put(invoice);

        updateRequest.onsuccess = () => {
          resolve(`Invoice with id ${id} updated successfully`);
        };

        updateRequest.onerror = () => {
          reject(`Error updating invoice with id ${id}`);
        };
      };

      request.onerror = () => {
        reject(`Error getting invoice with id ${id} for update`);
      };
    });
  });
};

export {
  openDatabase,
  addInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoiceById,
  deleteAllInvoices,
  updateInvoiceById
};
