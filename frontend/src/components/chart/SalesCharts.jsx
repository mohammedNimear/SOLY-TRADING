
// components/charts/SalesChart.jsx
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const SalesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#F9FAFB'
          }}
          labelStyle={{ color: '#F9FAFB' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
