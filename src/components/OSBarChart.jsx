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

const OSBarChart = () => {
  // Filled w/ sample data for now
  const data = [
    { day: "Sunday", variance: 66.6 },
    { day: "Monday", variance: 4.2 },
    { day: "Tuesday", variance: 69 },
    { day: "Wednesday", variance: 8.008135 },
    { day: "Thursday", variance: 0.6 },
    { day: "Friday", variance: 17.38 },
    { day: "Saturday", variance: 0.08 },
  ];

  return (
    <div>
      <BarChart width={600} height={300} data={data}>
        {/* X-axis */}
        <XAxis dataKey="day" />
        {/* Y-axis */}
        <YAxis />
        {/* Grid */}
        <CartesianGrid strokeDasharray="3 3" />
        {/* Tooltips --- Recharts tooltips are apparently highly customizable */}
        <Tooltip />
        {/* Legend */}
        <Legend />
        {/* Bar */}
        <Bar dataKey="variance" fill="#8884d8" className="hover:bg-blue-500" />
      </BarChart>
    </div>
  );
};

export default OSBarChart;
