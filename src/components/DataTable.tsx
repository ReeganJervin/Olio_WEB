// src/components/ServicesTable.js
import { useState, useEffect } from 'react';
import { fetchData, postData, putData, deleteData } from '../api'; // Import `putData` for updating services
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, ButtonGroup, IconButton} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './ServicesTable.css';

const ServicesTable = () => {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To track if the modal is in edit mode
  const [currentServiceId, setCurrentServiceId] = useState(null); // To store the ID of the service being edited
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page, default 10
  const [nameError, setNameError] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    season: '',
    active_status: '',
    created_by: 'Reegan'
  });

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await fetchData('/api/v1/services/');
        setServices(data.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    getServices();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setIsEditing(false);
    setCurrentServiceId(null);
    resetServiceForm();
  };

  const handleChange = (e : any) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      if (isEditing && currentServiceId) {
        // Update service if in edit mode
        await putData(`/api/v1/services/${currentServiceId}`, newService);
      } else {
        // Create new service if not in edit mode
        await postData('/api/v1/services/', newService);
      }
      setOpen(false);
      setViewOpen(false);
      setIsEditing(false);
      setCurrentServiceId(null);
      const updatedServices = await fetchData('/api/v1/services/');
      setServices(updatedServices.data);
      resetServiceForm();
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const handleEdit = (service : any) => {
    setCurrentServiceId(service.id); // Set the ID of the service being edited
    setNewService({
      name: service.name,
      category: service.category,
      season: service.season,
      active_status: service.active_status,
      created_by: service.created_by
    });
    setIsEditing(true);
    handleOpen();
  };

  const resetServiceForm = () => {
    setNewService({
      name: '',
      category: '',
      season: '',
      active_status: '',
      created_by: 'Reegan'
    });
  };

  const filteredServices = services.filter((service : any) => {
    console.log("Service Status:", service.active_status, "Current Filter:", filter);
    if (filter === 'All' || service.active_status === filter) {
      return !search || Object.values(service).some((val : any ) => val.toString().toLowerCase().includes(search.toLowerCase()));
    }
    return false;
  });

  const handleView = (service : any) => {
    setCurrentServiceId(service.id); // Set the ID of the service being edited
    setNewService({
      name: service.name,
      category: service.category,
      season: service.season,
      active_status: service.active_status,
      created_by: service.created_by
    });
    setViewOpen(true);
    handleOpen();
  };
  const toggleEditMode = () => setIsEditing(!isEditing);

  // Calculate total pages and the services to display for the current page
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFilterChange = (newFilter : any) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleItemsPerPageChange = (event : any) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // const handleSliderChange = (event, newValue) => {
  //   handleItemsPerPageChange({ target: { value: newValue } });
  // };
  const handleSubmit = () => {
    if (!newService.name.trim()) {
      setNameError(true);
    } else {
      setNameError(false);
      handleCreate();
    }
  };

  const handleDelete = async (serviceId : any) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (confirmDelete) {
      try {
        await deleteData(`/api/v1/services/${serviceId}`);
        const updatedServices = services.filter((service: any) => service.id !== serviceId);
        setServices(updatedServices);
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Services</h2>
        <Button onClick={handleOpen} variant="contained" color="primary" className="add-service-button">
          + Add Service
        </Button>
      </div>
      <div className="table-controls">
        <button className={`filter-button ${filter === 'Active' ? 'active' : ''}`} onClick={() => handleFilterChange('Active')}>Active</button>
        <button className={`filter-button ${filter === 'Inactive' ? 'active' : ''}`} onClick={() => handleFilterChange('Inactive')}>Inactive</button>
        <button className={`filter-button ${filter === 'All' ? 'active' : ''}`} onClick={() => handleFilterChange('All')}>All</button>
        <input
          type="text"
          className="search-input"
          placeholder="Search all columns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="clear-button" onClick={() => { setFilter('All'); setSearch(''); setCurrentPage(1); }}>Clear Filters</button>
        {/* Rows per page dropdown */}


      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{textAlign:'left'}}>Name</th>
            <th>Category</th>
            <th>Season</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentServices.map((service : any, index) => (
            <tr key={index}>
              <td style={{textAlign:'left'}}>{service.name}</td>
              <td>{service.category}</td>
              <td>{service.season}</td>
              <td>{service.active_status}</td>
              <td>{new Date(service.created_dt).toLocaleDateString()}</td>
              <td>{service.created_by}</td>
              <td className="action-buttons">
                <button onClick={() => handleEdit(service)} className="edit-button">
                  <EditIcon />
                </button>
                <button onClick={() => handleView(service)} className="view-button">
                  <VisibilityIcon />
                </button>
                <button onClick={() => handleDelete(service.id)} className="delete-button">
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="pagination">
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>

        <ButtonGroup variant="outlined" aria-label="rows per page selection">
          {[5, 10, 15, 20].map(value => (
            <Button
              key={value}
              onClick={() => handleItemsPerPageChange({ target: { value } })}
              variant={itemsPerPage === value ? 'contained' : 'outlined'}
            >
              {value}
            </Button>
          ))}
        </ButtonGroup>

        <div className="page-info">
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
          <ArrowForwardIcon />
        </IconButton>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle className="modal-title">{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                required
                margin="dense"
                label="Service Name"
                name="name"
                value={newService.name}
                onChange={handleChange}
                fullWidth
                error={nameError}
                helperText={nameError ? 'Service Name is required' : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Category"
                name="category"
                value={newService.category}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Season"
                name="season"
                value={newService.season}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                margin="dense"
                label="Status"
                name="active_status"
                value={newService.active_status}
                onChange={handleChange}
                fullWidth
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 'auto',
                      },
                    },
                  },
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="cancel-button">Cancel</Button>
          <Button onClick={handleSubmit} className="create-button">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm">
        <DialogTitle className="modal-title">{isEditing ? "Edit Service" : "Service Details"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                label="Service Name"
                name="name"
                value={newService.name}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Category"
                name="category"
                value={newService.category}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Season"
                name="season"
                value={newService.season}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                margin="dense"
                label="Status"
                name="active_status"
                value={newService.active_status}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 'auto',
                      },
                    },
                  },
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {!isEditing ? (
            <Button onClick={toggleEditMode} color="primary">Edit</Button>
          ) : (
            <Button onClick={handleCreate} color="primary">Save</Button>
          )}
          <Button onClick={handleClose} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServicesTable;
