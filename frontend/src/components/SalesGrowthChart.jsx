import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

const SalesGrowthChart = ({ isLargeScreen }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://data-viz-three.vercel.app/api/data/salesgrowth');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
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

  const chartContent = (
    <BarChart
      xAxis={[{ scaleType: 'band', data: data.map(item => `${item._id.year}-${item._id.month}`) }]}
      series={[{ data: data.map(item => item.growthRate) }]}
      height={300}
    />
  );

  return (
    <>
      <Card onClick={handleClick} style={{ cursor: isLargeScreen ? 'pointer' : 'default' }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Sales Growth Rate
          </Typography>
          {chartContent}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Sales Growth Rate
          <Button onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
            X
          </Button>
        </DialogTitle>
        <DialogContent>
          {chartContent}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SalesGrowthChart;
