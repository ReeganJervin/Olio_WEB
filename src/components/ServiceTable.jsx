import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { fetchData } from '../api'; // Adjust the path as necessary
import dayjs from 'dayjs'; // For date formatting

// Install dayjs if you haven't already
// npm install dayjs

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    valueGetter: (params) =>params ?? 'N/A',
  },
  {
    field: 'active_status',
    headerName: 'Status',
    width: 130,
    valueGetter: (params) => params ?? 'N/A',
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    valueGetter: (params) => params ?? 'N/A',
  },
  {
    field: 'created_dt',
    headerName: 'Created Date',
    width: 180,
    valueGetter: (params) => dayjs(params).format('YYYY-MM-DD HH:mm'),
  },
  {
    field: 'season',
    headerName: 'Season',
    width: 130,
    valueGetter: (params) => params ?? 'N/A',
  },
  {
    field: 'created_by',
    headerName: 'Created By',
    width: 150,
    valueGetter: (params) => params ?? 'N/A',
  },
];

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Pagination settings (optional)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    // Fetch data from API on component mount
    const fetchTableData = async () => {
      try {
        const data = await fetchData('/api/v1/services/'); // Replace with your actual endpoint

        // If your API returns data in a nested structure, adjust accordingly
        // For example, if data is { items: [...] }, use data.items

        // Optional: Transform data if field names differ
        // const formattedData = data.map(item => ({
        //   id: item.id,
        //   name: item.name,
        //   active_status: item.active_status,
        //   category: item.category,
        //   created_by: item.created_by,
        //   created_dt: item.created_dt,
        //   lastupdate_ts: item.lastupdate_ts,
        //   season: item.season,
        //   status: item.status,
        // }));
        console.log("_______ data ____",data.data)
        setRows(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <Paper sx={{ height: 600, width: '100%', padding: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ border: 0 }}
        // Additional props for better UX
        loading={loading}
        error={error}
      />
    </Paper>
  );
}

