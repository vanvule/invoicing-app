import { DownloadOutlined, EditOutlined, FilePdfOutlined, FundViewOutlined, MailOutlined, PrinterOutlined } from '@ant-design/icons';
import type { GetProp, TableProps } from 'antd';
import { Button, Input, message, Modal, Space, Table, Tag, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { useFilterContext } from '../../context/FilterContext';
import { getInvoiceById, getInvoices, updateInvoiceById } from '../../stored/stored';
import { Invoice } from '../../stored/stored.type';
import { FilterBar } from '../Filter/FilterBar';
import { renderInvoiceBody } from './RenderInvoiceBody';


type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType {
  invoiceId: number;
  billedTo: string;
  invoiceDate: Record<string, Dayjs | any>;
  status: 'Draft' | 'Paid' | 'Not Paid' | 'Inprogress';
  key: number;
}

type InvoiceTableProps = {
  draftMode?: boolean;
};

export const InvoiceTable: React.FC = (props: InvoiceTableProps) => {
  const [data, setData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [rowSelection, setRowSelection] = useState<TableRowSelection<DataType> | undefined>({});

  const [visible, setVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'view' | 'edit'>('view');
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [tempInvoice, setTempInvoice] = useState<Invoice | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [note, setNote] = useState<string>('');

  const { contractor, vat, from, to, status } = useFilterContext();

  useEffect(() => {
    const getData = async () => {
      const invoices = await fetchInvoices();
      // @ts-ignore
      setData(invoices);
    };

    getData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = data;

      if (contractor !== 'All contractors') {
        filtered = filtered.filter(item => item.billedTo === contractor);
      }

      if (vat !== 'VAT') {
        filtered = filtered.filter(item => item.invoiceId.toString().includes(vat));
      }

      if (from) {
        filtered = filtered.filter(item => dayjs(item.invoiceDate.$d).isAfter(dayjs(from)));
      }

      if (to) {
        filtered = filtered.filter(item => dayjs(item.invoiceDate.$d).isBefore(dayjs(to)));
      }

      if (status !== 'All') {
        filtered = filtered.filter(item => item.status === status);
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [contractor, vat, from, to, status, data]);

  const handleView = async(record: DataType) => {
    setSelectedRecord(record);
    setVisible(true);
    setModalType('view');

    setModalLoading(true);

    const invoice= await getInvoiceById(record.invoiceId);
    setTempInvoice(invoice);
    setModalLoading(false);
  };

  const handleEdit = async(record: DataType) => {
    setSelectedRecord(record);
    setModalType('edit');
    setVisible(true);

    setModalLoading(true);
    const invoice = await getInvoiceById(record.invoiceId);
    setTempInvoice(invoice);
    setNote(invoice.note);
    setModalLoading(false);
  }

  const handleSaveNote = async() => {
    await updateInvoiceById(tempInvoice?.id as number, { ...tempInvoice, note });
    setVisible(false);
    message.success('Note updated successfully');
  }

  const handleDownload = (record: DataType) => {
    const dataStr = JSON.stringify(record, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${record.invoiceId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePdfDownload = (record: DataType) => {
    const doc = new jsPDF();
    doc.text(`Invoice ID: ${record.invoiceId}`, 10, 10);
    doc.text(`Billed To: ${record.billedTo}`, 10, 20);
    doc.text(`Invoice Date: ${dayjs(record.invoiceDate.$d).format('DD/MM/YYYY')}`, 10, 30);
    doc.text(`Status: ${record.status}`, 10, 40);
    doc.save(`Invoice-${record.invoiceId}.pdf`);
  };

  const handlePrint = (record: DataType) => {
    const content = `
      <div>
        <h1>Invoice ID: ${record.invoiceId}</h1>
        <p>Billed To: ${record.billedTo}</p>
        <p>Invoice Date: ${dayjs(record.invoiceDate.$d).format('DD/MM/YYYY')}</p>
        <p>Status: ${record.status}</p>
      </div>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmail = (record: DataType) => {
    const subject = `Invoice ID: ${record.invoiceId}`;
    const body = `
      Invoice ID: ${record.invoiceId}%0D%0A
      Billed To: ${record.billedTo}%0D%0A
      Invoice Date: ${dayjs(record.invoiceDate.$d).format('DD/MM/YYYY')}%0D%0A
      Status: ${record.status}
    `;
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Invoice ID',
      dataIndex: 'invoiceId',
      sorter: (a, b) => a.invoiceId - b.invoiceId,
    },
    {
      title: 'Billed to',
      dataIndex: 'billedTo',
      sorter: (a, b) => a.billedTo.localeCompare(b.billedTo),
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      // sort by date
      sorter: (a, b) => a.invoiceDate.$d - b.invoiceDate.$d,
      render: (invoiceDate: DataType['invoiceDate']) => {
        return dayjs(invoiceDate.$d).format('DD/MM/YYYY');
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: DataType['status']) => {
        return (
          <span>
            {status === 'Draft' && <Tag color="blue">Draft</Tag>}
            {status === 'Paid' && <Tag color="green">Paid</Tag>}
            {status === 'Not Paid' && <Tag color="red">Not Paid</Tag>}
            {status === 'Inprogress' && <Tag color="orange">Inprogress</Tag>}
          </span>
        );
      },
      filters: [
        { text: 'Draft', value: 'Draft' },
        { text: 'Paid', value: 'Paid' },
        { text: 'Not Paid', value: 'Not Paid' },
        { text: 'Inprogress', value: 'Inprogress' },
      ],
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Download JSON">
            <DownloadOutlined onClick={() => handleDownload(record)} />
          </Tooltip>
          <Tooltip title="Download PDF">
            <FilePdfOutlined onClick={() => handlePdfDownload(record)} />
          </Tooltip>
          <Tooltip title="Print">
            <PrinterOutlined onClick={() => handlePrint(record)} />
          </Tooltip>
          <Tooltip title="Send Email">
            <MailOutlined onClick={() => handleEmail(record)} />
          </Tooltip>
          <Tooltip title="View Details">
            <FundViewOutlined onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Add/Edit Note (How to pay it, where to send checks, etc.)">
            <EditOutlined onClick={() => handleEdit(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const fetchInvoices = async () => {
    const invoices = await getInvoices();
    return invoices.map((invoice) => ({
      key: invoice.id,
      invoiceId: invoice.id,
      billedTo: invoice.contractor,
      invoiceDate: invoice.invoiceDate,
      status: invoice.status,
    }));
  }

  const renderInvoiceEditNote = (invoice: Invoice) => {
    return (
      <Input.TextArea
        placeholder="Add invoice note (How to pay it, where to send checks, etc.)"
        defaultValue={invoice.note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
      />
    );
  }

  return (
    <>
      <FilterBar />

      <Table
        pagination={{ position: ['bottomRight'] }}
        columns={columns}
        dataSource={filteredData}
        rowSelection={rowSelection}
      />

      <Modal
        title={`Invoice ID: ${selectedRecord?.invoiceId}`}
        visible={visible}
        onCancel={() => setVisible(false)}
        loading={modalLoading}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {modalType === 'edit' ? (
              <>
                <CancelBtn />
                <Button
                  type="primary"
                  onClick={handleSaveNote}
                >
                  Save
                </Button>
              </>
            ) : null}
          </>
        )}
      >
        {tempInvoice && modalType === 'view' && renderInvoiceBody(tempInvoice)}
        {tempInvoice && modalType === 'edit' && renderInvoiceEditNote(tempInvoice)}
      </Modal>
    </>
  );
};
