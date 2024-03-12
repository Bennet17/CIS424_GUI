import Chart from "react-apexcharts";
import axios from "axios";
import React, { useState, useEffect } from "react";

// Component for displaying a bar chart representing Over/Short by Day
const OSBarChart = () => {
  // Options for the ApexCharts bar chart
  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true, // Display the toolbar with the hamburger menu
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
        return value.toFixed(2); // Format decimal for bars' data labels
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
    colors: ["#008FFB"], // Color of the bars
    title: {
      text: "Over/Short by Day", // Title of the chart
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
            text: "Zero Variance", // Annotation for zero variance
          },
        },
      ],
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value) {
          return value.toFixed(2); // Display values as currency
        },
      },
    },
  };

  // Series data for the chart
  const series = [
    {
      name: "Variance",
      data: [6.66, 4.2, -6.9, -8.008135, 3.14159, -1.812, 8.08], // Data representing variance
    },
  ];

  useEffect(() => {
    function Initialize(){
        axios.post(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GeneralVariance`, {
          "storeID": "1",
          "startDate": "2024-02-01",
          "endDate": "2024-02-16"
        })
        .then(response => {
          console.log(response);
          if (true){
            //poop
          }else{
              //something broke, oh no
          }
        })
        .catch(error => {
            console.error(error);
        });
    }

    Initialize();
  }, []);

  // Return the JSX for rendering the chart
  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-3/4">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default OSBarChart;
