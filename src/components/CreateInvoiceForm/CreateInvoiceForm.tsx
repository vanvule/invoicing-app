import { CloseOutlined, FileAddOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Form, Input, InputNumber, Layout, message, Select, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import formData from './formData.json';

import { addInvoice } from '../../stored/stored';
import { FeeSummary } from './FeeSummary';
import { FormData, FormField, Item } from './createInvoiceForm.type';
import { getStatusClassNames } from 'antd/es/_util/statusUtils';


const { Header, Content, Footer } = Layout;
const { Option } = Select;

const initialItem: Item = {
  details: '',
  quantity: 0,
  price: 0,
  amount: 0,
};

export const CreateInvoiceForm: React.FC = () => {
  const [data, setData] = useState<FormData>({ formFields: [], tableItems: [] });
  const [items, setItems] = useState<Item[]>([initialItem]);
  const formRef = useRef<any>();

  useEffect(() => {
    // @ts-ignore
    setData(formData);
  }, []);

  const handleAddRow = () => {
    setItems([...items, { ...initialItem }]);
  };

  const renderFormField = (field: FormField) => {
    const rules = field.validation ? [field.validation] : [];
    switch (field.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'text':
        return <Input />;
      case 'dateTime':
        return <DatePicker showTime style={{ width: '100%' }} />;
      case 'SingleSelect':
        return (
          <Select>
            {field.options?.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  const handleInputChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  const columns = data.tableItems.map((column) => ({
    title: column.label,
    dataIndex: column.id,
    key: column.id,
    render: (text: any, record: Item, index: number) => {
      const validationRules = column.validation ? [column.validation] : [];
      if (column.type === 'number') {
        return (
          <Form.Item
            name={[index, column.id]}
            // rules={validationRules}
            initialValue={record[column.id as keyof Item]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              value={record[column.id as keyof Item]}
              onChange={(value) => handleInputChange(index, column.id as keyof Item, value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        );
      } else {
        return (
          <Form.Item
            name={[index, column.id]}
            // rules={validationRules}
            initialValue={record[column.id as keyof Item]}
            style={{ marginBottom: 0 }}
          >
            <Input
              value={record[column.id as keyof Item]}
              onChange={(e) => handleInputChange(index, column.id as keyof Item, e.target.value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        );
      }
    },
  }));

  const onFinish = async (values: any) => {
    const getStatus = ():'Paid' | 'Not Paid' => {
      return items.some(item => item !== initialItem) ? 'Paid' : 'Not Paid';
    }
    await addInvoice({
      ...values,
      items,
      status: getStatus(),
    });
    message.success('Form submitted successfully!');
    window.location.href = '/all-invoices';
  };

  const handleSave = async (type:string) => {
    await addInvoice({
      ...formRef.current.getFieldsValue(),
      items,
      status: type,
    });
    message.success('Form saved as a draft!');
    window.location.href = '/all-invoices';
  }

  return (
    <Layout>
      <Content style={{ margin: '16px' }}>
        <Form
          id="invoiceForm"
          layout="vertical"
          onFinish={onFinish}
          ref={formRef}
          initialValues={{
            documentNumber: '',
            documentType: '',
            prepared: '',
            contractor: '',
            format: '',
            bankAccount: '',
            invoiceDate: null,
            dueDate: null,
            payment: '',
          }}
        >
          <Flex
            style={{
              padding: 16,
              borderRadius: 10,
              backgroundColor: '#fafafa',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {data.formFields.map((field) => (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={field.label}
                  rules={field.validation ? [field.validation] : []}
                  style={{ flex: '1 1 30%' }}
                >
                  {renderFormField(field)}
                </Form.Item>
              ))}
            </div>
          </Flex>

          <Flex
            style={{
              padding: 16,
              borderRadius: 10,
              backgroundColor: '#fafafa',
            }}
          >
            <Table
              dataSource={items}
              columns={columns}
              pagination={false}
              rowKey="details"
              style={{ marginBottom: 16, width: '100%', }}
              footer={() => (
                <Button type="dashed" onClick={handleAddRow} style={{ width: '100%' }}>
                  <PlusOutlined /> Add Row
                </Button>
              )}
            />
          </Flex>


        </Form>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Flex
          justify='space-between'
        >
          <FeeSummary />

          <Flex
          >
            <Button
              type="default"
              icon={<CloseOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => window.location.href = '/all-invoices'}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form="invoiceForm"
              icon={<SaveOutlined />} style={{ marginRight: 8 }}
            >
              Save
            </Button>

            {/* <Button
              type="default"
              htmlType="button"
              onClick={() => handleSave('Inprogress')}
              icon={<FileAddOutlined />}
            >
              Save as a draft
            </Button> */}

            <Button
              type="default"
              htmlType="button"
              onClick={() => handleSave('Draft')}
              icon={<FileAddOutlined />}
              disabled={!formRef.current?.isFieldsTouched()}
            >
              Save as a draft
            </Button>
          </Flex>

        </Flex>
      </Footer>
    </Layout>
  );
};
