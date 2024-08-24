import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

const RepeatCustomersChart = ({ isLargeScreen }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [interval, setInterval] = useState('daily');

  useEffect(() => {
    fetchData();
  }, [interval]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/data/repeatcustomers?interval=${interval}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching repeat customers data:', error);
    }
  };

  const handleClick = () => {
    if (isLargeScreen) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const chartContent = (
    <BarChart
      xAxis={[{ scaleType: 'band', data: data.map(item => `${item._id.year}-${item._id.month}`) }]}
      series={[{ data: data.map(item => item.count) }]}
      height={300}
    />
  );

  return (
    <>
      <Card onClick={handleClick} style={{ cursor: isLargeScreen ? 'pointer' : 'default' }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Repeat Customers
          </Typography>
          {chartContent}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Repeat Customers
          <Button onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
            X
          </Button>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <Select value={interval} onChange={handleIntervalChange}>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          {chartContent}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RepeatCustomersChart;
