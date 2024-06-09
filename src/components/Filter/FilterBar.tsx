import React from 'react';
import { Button, Select, DatePicker, Space, Flex } from 'antd';
import { useFilterContext } from '../../context/FilterContext';

const { Option } = Select;

export const FilterBar: React.FC = () => {
  const {
    contractor,
    vat,
    from,
    to,
    status,
    setContractor,
    setVat,
    setFrom,
    setTo,
    setStatus,
  } = useFilterContext();

  const renderFilterButton = (['All', 'Edit', 'Paid', 'Draft', 'Inprogress'] as const).map((item) => (
    <Button
      key={item}
      onClick={() => setStatus(item)}
      type={status === item ? 'primary' : 'text'}
    >
      {item}
    </Button>
  ));

  return (
    <>
      <Flex
        justify="space-between"
        style={{ padding: 16, borderRadius: 10, backgroundColor: '#fafafa', margin: 16 }}
      >
        <Space
        >
          {renderFilterButton}
        </Space>
        <Button
          onClick={() => window.location.href = '/create-invoice'}
          type="primary"
        >Create a new invoice</Button>
      </Flex>

      <Flex
        justify="space-between"
        style={{ padding: 16, borderRadius: 10, backgroundColor: '#fafafa', margin: 16 }}
      >
        <Select value={contractor} onChange={setContractor} style={{ width: 150 }}>
          <Option
            value="All contractors"
            options={[
              { value: 'All contractors', label: 'All contractors' },
              { value: 'Contractor 1', label: 'Contractor 1' },
              { value: 'Contractor 2', label: 'Contractor 2' },
              { value: 'Contractor 3', label: 'Contractor 3' },
            ]}
          >
            All contractors
          </Option>

        </Select>
        <Select value={vat} onChange={setVat} style={{ width: 100 }}>
          <Option value="VAT">VAT</Option>
        </Select>
        <DatePicker placeholder="From" onChange={(date, dateString) => setFrom(dateString as string)} />
        <DatePicker placeholder="To" onChange={(date, dateString) => setTo(dateString as string)} />
        <Select value={status} onChange={setStatus} style={{ width: 150 }}>
          <Option
            value="All statuses"
            options={[
              { label: 'Draft', value: 'Draft' },
              { label: 'Paid', value: 'Paid' },
              { label: 'Not Paid', value: 'Not Paid' },
              { label: 'Inprogress', value: 'Inprogress' },
            ]}
          >All statuses</Option>

        </Select>
        <Button type="text" icon={<i className="anticon anticon-filter" />}>More</Button>
      </Flex>
    </>

  );
};
