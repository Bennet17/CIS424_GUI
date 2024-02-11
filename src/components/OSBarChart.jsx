import React from "react";
import Chart from "react-apexcharts";

/*
const OSBarChart = () => {
  // Sample data
  const data = {
    labels: [
      "Sun. 2/4",
      "Mon. 2/5",
      "Tue. 2/6",
      "Wed. 2/7",
      "Thu. 2/8",
      "Fri. 2/9",
      "Sat. 2/10",
    ],
    series: [
      {
        name: "Variance (USD)",
        data: [6.66, 4.2, -6.9, -8.008135, 3.14159, -1.812, 0.08],
      },
    ],
  };

  // Dynamically set colors based on positive or negative variance
  const seriesData = data.series[0].data.map((variance) => ({
    y: variance,
    fillColor: variance >= 0 ? "#8EE4AF" : "#FEB2B2",
  }));

  const options = {
    chart: {
      type: "bar",
      background: "#f9f9f9",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.labels,
      labels: {
        style: {
          fontSize: "18px",
        },
      },
      title: {
        text: "Open Days",
        style: {
          fontSize: "18px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Variance (USD)",
        style: {
          fontSize: "18px",
        },
      },
      labels: {
        style: {
          fontSize: "18px",
        },
      },
    },
    fill: {
      colors: seriesData.map((point) => point.fillColor),
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="w-3/4 h-3/4 bg-gray-100">
      <Chart
        options={options}
        series={[{ data: seriesData }]}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default OSBarChart;
*/

const OSBarChart = () => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true, // Hamburger menu
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#ed9d9d", // Red color for negative variance
            },
            {
              from: 0,
              to: Infinity,
              color: "#77d49a", // Green color for positive variance
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (value) {
        return value.toFixed(2); // Format decimal for bars' datalabels
      },
    },
    xaxis: {
      categories: [
        "Sun. 2/4",
        "Mon. 2/5",
        "Tue. 2/6",
        "Wed. 2/7",
        "Thu. 2/8",
        "Fri. 2/9",
        "Sat. 2/10",
      ],
      title: {
        text: "Date",
      },
    },
    yaxis: {
      title: {
        text: "Variance (USD)",
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0); // Format decimal for y-axis labels
        },
      },
    },
    colors: ["#008FFB"],
    title: {
      text: "Over/Short by Day",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        fontSize: "20px",
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: "#6c757d",
          borderWidth: 1,
          strokeDashArray: 5,
          label: {
            borderColor: "#6c757d",
            style: {
              color: "#fff",
              background: "#6c757d",
            },
            text: "Zero Variance",
          },
        },
      ],
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 12,
        height: 12,
        radius: 5,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
  };

  const series = [
    {
      name: "Variance",
      data: [6.66, 4.2, -6.9, -8.008135, 3.14159, -1.812, 8.08],
    },
  ];

  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-3/4">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default OSBarChart;

/*

Using Highcharts

import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const OSBarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chart = chartRef.current.chart;
      // Access Highcharts chart object here for further customization if needed
    }
  }, []);

  // Sample data
  const data = {
    labels: [
      "Sun. 2/4",
      "Mon. 2/5",
      "Tue. 2/6",
      "Wed. 2/7",
      "Thu. 2/8",
      "Fri. 2/9",
      "Sat. 2/10",
    ],
    series: [
      {
        name: "Variance (USD)",
        data: [6.66, 4.2, -6.9, -8.008135, 3.14159, -1.812, 0.08],
      },
    ],
  };

  // Dynamically set colors based on positive or negative variance
  const seriesData = data.series[0].data.map((variance) => ({
    y: variance,
    color: variance >= 0 ? "#8EE4AF" : "#FEB2B2",
  }));

  const options = {
    chart: {
      type: "column",
      backgroundColor: "#f9f9f9",
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: data.labels,
      labels: {
        style: {
          fontSize: "18px",
        },
      },
      title: {
        text: "Open Days",
        style: {
          fontSize: "18px",
        },
      },
    },
    yAxis: {
      title: {
        text: "Variance (USD)",
        style: {
          fontSize: "18px",
        },
      },
      labels: {
        style: {
          fontSize: "18px",
        },
      },
      plotLines: [
        {
          color: "black",
          width: 1,
          value: 0, // Set the value where the line will appear
          zIndex: 5, // Ensure it's above other elements
        },
      ],
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
      },
    },
    series: [
      {
        name: data.series[0].name,
        data: seriesData,
      },
    ],
  };

  return (
    <div className="w-3/4 h-3/4 bg-gray-100">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default OSBarChart;

*/

/* 

Using Chart.js:

import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend
);

const OSBarChart = () => {
  // Filled w/ sample data for now
  // This is the data that will be used to craft the bar chart
  const data = {
    labels: [
      "Sun. 2/4",
      "Mon. 2/5",
      "Tue. 2/6",
      "Wed. 2/7",
      "Thu. 2/8",
      "Fri. 2/9",
      "Sat. 2/10",
    ],
    datasets: [
      {
        label: "Variance (USD)",
        data: [6.66, 4.2, -6.9, -8.008135, 3.14159, -1.812, 0.08],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        hoverBackgroundColor: [],
        hoverBorderColor: [],
      },
    ],
  };

  // Dynamically set colors based on positive or negative variance
  data.datasets[0].data.forEach((variance) => {
    if (variance >= 0) {
      data.datasets[0].backgroundColor.push("#8EE4AF");
      data.datasets[0].borderColor.push("#8EE4AF");
      data.datasets[0].hoverBackgroundColor.push("#A3E4BF");
      data.datasets[0].hoverBorderColor.push("#A3E4BF");
    } else {
      data.datasets[0].backgroundColor.push("#FEB2B2");
      data.datasets[0].borderColor.push("#FEB2B2");
      data.datasets[0].hoverBackgroundColor.push("#FFA8A8");
      data.datasets[0].hoverBorderColor.push("#FFA8A8");
    }
  });

  return (
    <div className="w-1/2 h-1/2 bg-gray-100">
      <Bar
        data={data}
        options={{
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                ticks: {
                  fontSize: 40,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Open Days",
                  fontSize: 40,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontSize: 40,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Variance (USD)",
                  fontSize: 40,
                },
              },
            ],
          },
          legend: {
            display: false,
            position: "bottom",
          },
          tooltips: {
            enabled: true,
          },
        }}
      />
    </div>
  );
};

export default OSBarChart;

*/
