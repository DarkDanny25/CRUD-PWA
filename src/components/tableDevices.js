import React, { useEffect, useState } from 'react';
import { getDevices, deleteDevice } from '../api';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Pagination, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faMobilePhone, faDesktop, faSearch } from '@fortawesome/free-solid-svg-icons';
import DeviceForm from '../components/deviceForm';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // Cambia este número según tu necesidad

  const fetchDevices = async () => {
    const data = await getDevices();
    setDevices(data);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este dispositivo? Esta acción no se puede deshacer.');
    if (confirmDelete) {
      await deleteDevice(id);
      fetchDevices();
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setFormOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Resetear a la primera página al buscar
  };

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.year.toString().includes(searchQuery)
  );

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedDevices = filteredDevices.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField 
          label="Buscar Dispositivos" 
          variant="outlined" 
          value={searchQuery} 
          onChange={handleSearchChange} 
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FontAwesomeIcon icon={faSearch} />
              </InputAdornment>
            ),
          }}
          sx={{ width: '300px' }} // Establecer un ancho para el campo de búsqueda
        />
        <Button 
          variant="contained" 
          sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} // Color verde
          onClick={() => { setEditingDevice(null); setFormOpen(true); }} 
          endIcon={
            <Box display="flex" alignItems="center">
              <FontAwesomeIcon icon={faMobilePhone} style={{ marginRight: '3px' }} />
              <span style={{ margin: '0 3px' }}>/</span>
              <FontAwesomeIcon icon={faDesktop} style={{ marginLeft: '3px' }} />
            </Box>
          }
        >
          Agregar Dispositivo
        </Button>
      </Box>

      <TableContainer component={Paper} style={{ marginTop: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDevices.map((device, index) => (
              <TableRow key={device._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.brand}</TableCell>
                <TableCell>{device.model}</TableCell>
                <TableCell>{device.year}</TableCell>
                <TableCell align="center">
                  <Button 
                    onClick={() => handleEdit(device)} 
                    sx={{ marginLeft: '8px' }} 
                  >
                    <FontAwesomeIcon icon={faEdit} style={{ color: '#FFC107' }} />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(device._id)} 
                    sx={{ marginLeft: '8px' }} 
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Pagination 
        count={Math.ceil(filteredDevices.length / rowsPerPage)} 
        page={page} 
        onChange={handleChangePage} 
        variant="outlined" 
        shape="rounded" 
        style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }} 
      />

      <DeviceForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        device={editingDevice} 
        onSaved={fetchDevices} 
      />
    </div>
  );
};

export default DeviceList;