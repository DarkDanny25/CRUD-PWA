import React from 'react';
import DeviceList from './components/tableDevices';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '55px' }}>Bienvenido a nuestro CRUD de PWA</h1>
      <DeviceList />
    </div>
  );
};

export default App;