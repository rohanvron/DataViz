import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button, useTheme  } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';

const GeoDistributionChart = ({ isLargeScreen }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/geographicaldistribution');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching geographical distribution data:', error);
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
    <PieChart
      series={[
        {
          data: data.map(item => ({ id: item._id, value: item.count, label: item._id })),
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          animated: true,
        },
      ]}
      height={300}
      margin={{ top: 40, right: 10, bottom: 10, left: 10 }}
      slotProps={{
        legend: {
          direction: 'row',
          position: { vertical: 'top', horizontal: 'middle' },
          itemMarkWidth: 10,
          itemMarkHeight: 10,
          markGap: 5,
          itemGap: 10,
          labelStyle: {
            fontSize: 10,
            fill: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
        },
      }}
    />
  );
  

  return (
    <>
      <Card onClick={handleClick} style={{ cursor: isLargeScreen ? 'pointer' : 'default' }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Geographical Distribution
          </Typography>
          {chartContent}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Geographical Distribution
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

export default GeoDistributionChart;
