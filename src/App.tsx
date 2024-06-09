import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FilterProvider } from './context/FilterContext';

function App() {
  return (
    <FilterProvider>
      <Sidebar />
    </FilterProvider>
  );
}

export default App;
