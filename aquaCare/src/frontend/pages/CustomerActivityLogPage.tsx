import React from 'react';
import CustomerActivityLog from '../components/CustomerActivityLog';
import { useTranslation } from '../hooks/useTranslation';

const CustomerActivityLogPage = () => {
  const { direction } = useTranslation();
  
  return (
    <div style={{ direction }}>
      <CustomerActivityLog />
    </div>
  );
};

export default CustomerActivityLogPage;
