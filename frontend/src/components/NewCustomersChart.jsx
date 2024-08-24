import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";

const NewCustomersChart = ({ isLargeScreen }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [interval, setInterval] = useState("monthly");

  const formatData = (rawData) => {
    return rawData
      .map(item => {
        const date = new Date(item._id.year, item._id.month - 1, item._id.day || 1);
        const value = parseInt(item.count);
        return {
          date: isNaN(date.getTime()) ? null : date,
          value: isNaN(value) ? null : value
        };
      })
      .filter(item => item.date !== null && item.value !== null);
  };

  useEffect(() => {
    fetchData();
  }, [interval]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/data/newcustomers?interval=${interval}`
      );
      setData(formatData(response.data));
    } catch (error) {
      console.error("Error fetching new customers data:", error);
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
    <LineChart
      xAxis={[{ 
        dataKey: 'date',
        valueFormatter: (value) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
      }]}
      series={[
        {
          dataKey: 'value',
          area: true,
        },
      ]}
      dataset={data}
      height={300}
    />
  );

  return (
    <>
      <Card
        onClick={handleClick}
        style={{ cursor: isLargeScreen ? "pointer" : "default" }}
      >
        <CardContent>
          <Typography variant="h6" component="div">
            New Customers Over Time
          </Typography>
          {chartContent}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          New Customers Over Time
          <Button
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
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

export default NewCustomersChart;
