import React, { useEffect, useState } from 'react';
import { Modal, Button, TextField, Select, MenuItem, FormControl, FormHelperText, Box } from '@mui/material';
import { createDevice, updateDevice } from '../api';

const DeviceForm = ({ open, onClose, device, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    brand: '',
    model: '',
    year: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (device) {
        setFormData(device); // Cargar datos del dispositivo si existe
      } else {
        setFormData({ name: '', type: '', brand: '', model: '', year: '' }); // Limpiar el formulario
      }
      setErrors({}); // Limpiar errores al abrir el modal
    }
  }, [open, device]);

  const validateForm = () => {
    const newErrors = {};

    // Validaciones para todos los campos
    if (!formData.name) newErrors.name = 'El nombre es requerido.';
    if (!formData.type) newErrors.type = 'El tipo es requerido.';
    if (!formData.brand) newErrors.brand = 'La marca es requerida.';
    if (!formData.model) newErrors.model = 'El modelo es requerido.';

    // Validación para el año
    if (!formData.year) {
      newErrors.year = 'El año es requerido.';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'El año debe ser un número de 4 dígitos.';
    } else if (parseInt(formData.year, 10) < 1900 || parseInt(formData.year, 10) > new Date().getFullYear()) {
      newErrors.year = `El año debe estar entre 1900 y ${new Date().getFullYear()}.`;
    }

    // Validaciones adicionales
    if (formData.type && !['celular', 'computadora'].includes(formData.type)) {
      newErrors.type = 'El tipo debe ser "celular" o "computadora".';
    }

    if (formData.brand && !/^[a-zA-Z\s]*$/.test(formData.brand)) {
      newErrors.brand = 'La marca solo debe contener letras.';
    }

    if (formData.model && /[^\w\s]/.test(formData.model)) {
      newErrors.model = 'El modelo no debe contener signos.';
    }

    // Limitar caracteres
    if (formData.name.length > 50) newErrors.name = 'El nombre no debe exceder los 50 caracteres.';
    if (formData.brand.length > 30) newErrors.brand = 'La marca no debe exceder los 30 caracteres.';
    if (formData.model.length > 30) newErrors.model = 'El modelo no debe exceder los 30 caracteres.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retornar verdadero si no hay errores
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limitar a 4 dígitos para el año
    if (name === 'year' && value.length > 4) {
      setErrors({ ...errors, year: 'El año debe contener solo 4 dígitos.' });
    } else if (errors[name]) {
      setErrors({ ...errors, [name]: '' }); // Limpiar errores al cambiar el valor
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (device) {
          await updateDevice(device._id, formData); // Actualizar dispositivo
        } else {
          await createDevice(formData); // Crear nuevo dispositivo
        }
        onSaved(); // Llamar a la función para refrescar la lista
        onClose(); // Cerrar el modal después de guardar
      } catch (error) {
        console.error('Error al guardar el dispositivo:', error);
        // Manejo de error aquí si es necesario
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box 
        sx={{ 
          padding: '20px', 
          background: 'white', 
          margin: 'auto',
          borderRadius: '4px',
          boxShadow: 24,
          width: '400px',
          outline: 'none'
        }} 
      >
        <h2 style={{ textAlign: 'center' }}>{device ? 'Editar Dispositivo' : 'Agregar Dispositivo'}</h2>
        <form onSubmit={handleSubmit}>
          <TextField 
            name="name" 
            label="Nombre" 
            value={formData.name} 
            onChange={handleChange} 
            fullWidth 
            required 
            error={Boolean(errors.name)} 
            helperText={errors.name}
            inputProps={{ 
              maxLength: 50, 
              onKeyDown: (e) => { 
                const invalidChars = /[^a-zA-Z\s]/;
                if (invalidChars.test(e.key)) {
                  e.preventDefault();
                }
              }
            }} 
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth required error={Boolean(errors.type)} sx={{ mb: 2 }}>
            <Select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              displayEmpty
            >
              <MenuItem value="" disabled>Seleccione el tipo de dispositivo</MenuItem>
              <MenuItem value="celular">Celular</MenuItem>
              <MenuItem value="computadora">Computadora</MenuItem>
            </Select>
            <FormHelperText>{errors.type}</FormHelperText>
          </FormControl>
          <TextField 
            name="brand" 
            label="Marca" 
            value={formData.brand} 
            onChange={handleChange} 
            fullWidth 
            required 
            error={Boolean(errors.brand)} 
            helperText={errors.brand}
            inputProps={{ 
              maxLength: 30, 
              onKeyDown: (e) => { 
                const invalidChars = /[^a-zA-Z\s]/;
                if (invalidChars.test(e.key)) {
                  e.preventDefault();
                }
              }
            }} 
            sx={{ mb: 2 }}
          />
          <TextField 
            name="model" 
            label="Modelo" 
            value={formData.model} 
            onChange={handleChange} 
            fullWidth 
            required 
            error={Boolean(errors.model)} 
            helperText={errors.model}
            inputProps={{ 
              maxLength: 30, 
              onKeyDown: (e) => { 
                const invalidChars = /[^\w\s]/;
                if (invalidChars.test(e.key)) {
                  e.preventDefault();
                }
              }
            }} 
            sx={{ mb: 2 }}
          />
          <TextField 
            name="year" 
            label="Año" 
            value={formData.year} 
            onChange={handleChange} 
            type="number" 
            fullWidth 
            required 
            error={Boolean(errors.year)} 
            helperText={errors.year}
            inputProps={{
              min: 1900,
              max: new Date().getFullYear(),
              onWheel: (e) => e.target.blur(),
              maxLength: 4
            }}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                backgroundColor: device ? '#FFC107' : 'green',
                '&:hover': {
                  backgroundColor: device ? '#FFA000' : 'darkgreen'
                }
              }}
            >
              {device ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default DeviceForm;