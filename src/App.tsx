// src/pages/AdminPage.jsx
import React from 'react';
import Header from '../src/components/Header';
import DataTable from '../src/components/DataTable';
import Sidebar from '../src/components/Sidebar';
import { Box } from '@mui/material';

export default function AdminPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar component */}
      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Box sx={{ padding: 2 }}>
          <DataTable />
        </Box>
      </Box>
    </Box>
  );
}
