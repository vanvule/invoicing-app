import { Flex } from 'antd';
import React from 'react';

import { CalculatorOutlined, DollarOutlined, PercentageOutlined } from '@ant-design/icons';
import { Col, Typography } from 'antd';

const { Text } = Typography;

type feeSummaryProps = {}

export const FeeSummary: React.FC = (props: feeSummaryProps) => {
  return (
    <Flex>
    <Col style={{ textAlign: 'center', marginRight: 8 }}>
      <CalculatorOutlined style={{ marginRight: 4, color: '#0e2c6a' }} />
      <Text style={{ marginRight: 4, color: '#0e2c6a' }}>Tax Base</Text>
      <Text style={{ color: '#0e2c6a' }}>0 BGN</Text>
      <Text style={{ marginLeft: 8, color: '#0e2c6a' }}>|</Text>
    </Col>

    <Col style={{ textAlign: 'center', marginRight: 8 }}>
      <PercentageOutlined style={{ marginRight: 4 }} />
      <Text style={{ marginRight: 4, color: '#0e2c6a' }}>VAT</Text>
      <Text style={{ marginLeft: 4, color: '#0e2c6a' }}>0 BGN</Text>
      <Text style={{ marginLeft: 8, color: '#0e2c6a' }}>|</Text>
    </Col>

    <Col style={{ textAlign: 'center', marginRight: 8 }}>
      <DollarOutlined style={{ marginRight: 4, color: '#0e2c6a' }} />
      <Text style={{ fontWeight: 'bold', color: '#0e2c6a' }}>Total</Text>
      <Text style={{ marginLeft: 4, fontWeight: 'bold', color: '#0e2c6a' }}>0 BGN</Text>
    </Col>
  </Flex>
  );
}
            
