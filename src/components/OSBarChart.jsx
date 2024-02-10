import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const BarChartComponent = () => {
  // Filled w/ sample data for now
  const data = [
    { name: "A", value: 100 },
    { name: "B", value: 200 },
    { name: "C", value: 300 },
    { name: "D", value: 400 },
    { name: "E", value: 500 },
  ];

  return (
    <BarChart width={600} height={300} data={data}>
      {/* X-axis */}
      <XAxis dataKey="name" />
      {/* Y-axis */}
      <YAxis />
      {/* Grid */}
      <CartesianGrid strokeDasharray="3 3" />
      {/* Tooltips */}
      <Tooltip />
      {/* Legend */}
      <Legend />
      {/* Bar */}
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};

export default BarChartComponent;
