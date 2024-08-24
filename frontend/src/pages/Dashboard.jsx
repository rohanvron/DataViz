import React from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import TotalSalesChart from '../components/TotalSalesChart';
import SalesGrowthChart from '../components/SalesGrowthChart';
import NewCustomersChart from '../components/NewCustomersChart';
import RepeatCustomersChart from '../components/RepeatCustomersChart';
import GeoDistributionChart from '../components/GeoDistributionChart';
import CustomerLifetimeValueChart from '../components/CustomerLifetimeValueChart';

const Dashboard = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid container spacing={3} padding={3}>
      <Grid item xs={12} md={6}>
        <TotalSalesChart isLargeScreen={isLargeScreen} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SalesGrowthChart isLargeScreen={isLargeScreen} />
      </Grid>
      <Grid item xs={12} md={6}>
        <NewCustomersChart isLargeScreen={isLargeScreen} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RepeatCustomersChart isLargeScreen={isLargeScreen} />
      </Grid>
      <Grid item xs={12} md={6}>
        <GeoDistributionChart isLargeScreen={isLargeScreen} />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomerLifetimeValueChart isLargeScreen={isLargeScreen} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
