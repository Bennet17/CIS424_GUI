import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import axios from "axios";

import { useAuth } from "../AuthProvider.js";

// Component for displaying a bar chart representing Over/Short by Day
const OSBarChart = () => {
  const defaultAnnotationOffset = -3;
  const [chartData, setChartData] = useState({ series: [], categories: [] });
  const [annotationOffset, setAnnotationOffset] = useState(
    defaultAnnotationOffset
  );

  //import the authentication function from AuthProvider.js
  const auth = useAuth();

  useEffect(() => {
    fetchData();
  }, [auth.cookie.user.viewingStoreID]); // Run once when the component mounts

  // Update annotation positioning whenever chart data changes
  useEffect(() => {
    if (chartData.series.length > 0) {
      const lastVarianceVal =
        chartData.series[0].data[chartData.series[0].data.length - 1];
      setAnnotationOffset(lastVarianceVal > 0 ? 20 : defaultAnnotationOffset);
    }
  }, [chartData]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateOtherWay = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero based
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}-${year}`;
  };

  const fetchData = async () => {
    // TODO - Correct route but it's not working
    const storeID = auth.cookie.user.viewingStoreID;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14); // Days shown in chart, should be a constant but who cares
    console.log(formatDate(endDate));
    console.log(formatDate(startDate));

    const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GeneralVariance?storeID=${
      auth.cookie.user.viewingStoreID
    }&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;

    try {
      const response = await axios.get(url);
      const data = response.data; // Response data is array of objects with amountExpected, total, Variance, and Date
      console.log(data);

      setChartData({
        // Map returned variance values to chart y-axis coordinates
        series: [
          {
            name: "Variance",
            data: data.map((dayVariance) => dayVariance.variance),
          },
        ],
        // Map corresponding date values
        // Looks scary but it's all formatting
        categories: data.map((weekday) => {
          const date = new Date(weekday.date); // Get date from data
          const dayOfWeek = date.toLocaleDateString("en-US", {
            weekday: "short",
          }); // Get the short day name (e.g., "Mon")
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "2-digit",
          }); // Get the formatted date (e.g., "2/01")
          return `${dayOfWeek}. ${formattedDate}`;
        }),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { series, categories } = chartData;

  // Options for the ApexCharts bar chart
  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true, // Display the toolbar with the hamburger menu
        export: {
          svg: {
            filename: `${
              auth.cookie.user.viewingStoreLocation
            }_BiweekSummary_${formatDateOtherWay(new Date())}`,
          },
          png: {
            filename: `${
              auth.cookie.user.viewingStoreLocation
            }_BiweekSummary_${formatDateOtherWay(new Date())}`,
          },
          csv: {
            filename: `${
              auth.cookie.user.viewingStoreLocation
            }_BiweekSummary_${formatDateOtherWay(new Date())}`,
          },
        },
      },
      fontFamily: "Roboto, sans-serif", // Chart font
      foreColor: "#616161", // HEX CODE FOR GRAY-700
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
      style: {
        colors: ["#616161"],
      },
      formatter: function (value) {
        // This wizardry shows no datalabel if it is 0, () if it is negative, and normal otherwise (all to 2 decimal places)
        return value !== 0
          ? value < 0
            ? `(${Math.abs(value).toFixed(2)})`
            : value.toFixed(2)
          : "";
      },
    },
    xaxis: {
      categories: categories,
      title: {
        text: "Date",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
        offsetX: -35, // TM: Hacky attempt to achieve true center
      },
    },
    yaxis: {
      title: {
        text: "Variance (USD)",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0); // Format decimal for y-axis labels
        },
      },
    },
    colors: ["#008FFB"], // Color of the bars
    title: {
      text: `${auth.cookie.user.viewingStoreLocation}'s Bi-Week Over/Short Summary`, // Title of the chart
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    // TM: This is the 'No Variance' label
    // annotations: {
    //   yaxis: [
    //     {
    //       y: 0,
    //       borderColor: "#6c757d",
    //       borderWidth: 1,
    //       strokeDashArray: 5,
    //       label: {
    //         borderColor: "#6c757d",
    //         style: {
    //           color: "#fff",
    //           background: "#6c757d",
    //         },
    //         text: "No Variance", // Annotation for zero variance
    //         offsetY: annotationOffset,
    //       },
    //     },
    //   ],
    // },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value) {
          return value.toFixed(2); // Format decimal for bars' data labels
        },
      },
    },
  };

  // Return the JSX for rendering the chart
  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-3/4">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default OSBarChart;
