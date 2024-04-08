import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToggleLeft, ToggleRight } from "lucide-react";

import { useAuth } from "../AuthProvider.js";
import { chart } from "highcharts";

// Component for displaying a bar chart representing Over/Short by Day
const OSBarChart = () => {
  const [chartData, setChartData] = useState({ series: [], categories: [] });
  const [totalVariance, setTotalVariance] = useState(0);

  // Bi-Week or Month-to-Date
  const [chartVersion, setChartVersion] = useState(0);

  //import the authentication function from AuthProvider.js
  const auth = useAuth();

  // update chart data
  useEffect(() => {
    fetchData();
  }, [auth.cookie.user.viewingStoreID, chartVersion]);

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
    const endDate = new Date();
    const startDate = new Date();
    if (chartVersion === 0) {
      startDate.setDate(endDate.getDate() - 14); // Days shown in chart, should be a constant but who cares
    } else {
      startDate.setDate(1);
      console.log(formatDate(startDate));
    }

    const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GeneralVariance?storeID=${
      auth.cookie.user.viewingStoreID
    }&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data; // Response data is array of objects with amountExpected, total, Variance, and Date

        // Add an extra value for variance sum
        let varianceSum = 0;

        setChartData({
          // Map returned variance values to chart y-axis coordinates
          series: [
            {
              name: "Variance",
              data: [
                ...data.map((dayVariance) => {
                  varianceSum += dayVariance.variance;
                  return dayVariance.variance;
                }),
                varianceSum.toFixed(2),
              ],
            },
          ],
          // Map corresponding date values
          // Looks scary but it's all formatting
          categories: [
            ...data.map((weekday) => {
              const date = new Date(weekday.date); // Get date from data
              // const dayOfWeek = date.toLocaleDateString("en-US", {
              //   weekday: "short",
              // }); // Get the short day name (e.g., "Mon")
              const formattedDate = date.toLocaleDateString("en-US", {
                month: "numeric",
                day: "2-digit",
              }); // Get the formatted date (e.g., "2/01")
              return `${formattedDate}`;
            }),
            "Total",
          ],
        });

        setTotalVariance(varianceSum.toFixed(2));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
            filename:
              chartVersion === 0
                ? `${
                    auth.cookie.user.viewingStoreLocation
                  }_BW_Summary_${formatDateOtherWay(new Date())}`
                : `${
                    auth.cookie.user.viewingStoreLocation
                  }_MTD_Summary_${formatDateOtherWay(new Date())}`,
          },
          png: {
            filename:
              chartVersion === 0
                ? `${
                    auth.cookie.user.viewingStoreLocation
                  }_BW_Summary_${formatDateOtherWay(new Date())}`
                : `${
                    auth.cookie.user.viewingStoreLocation
                  }_MTD_Summary_${formatDateOtherWay(new Date())}`,
          },
          csv: {
            filename:
              chartVersion === 0
                ? `${
                    auth.cookie.user.viewingStoreLocation
                  }_BW_Summary_${formatDateOtherWay(new Date())}`
                : `${
                    auth.cookie.user.viewingStoreLocation
                  }_MTD_Summary_${formatDateOtherWay(new Date())}`,
          },
        },
      },
      fontFamily: "Roboto, sans-serif", // Chart font
      foreColor: "#616161", // HEX CODE FOR GRAY-700
    },
    subtitle: {
      text: "(Data labels are rounded to the next whole number)",
      align: "center",
      offsetY: 50,
      style: {
        fontSize: "12px",
        color: "#6c757d",
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
              to: -2,
              color: "#ed9d9d", // Red color for negative variance
            },
            {
              from: -2,
              to: 2,
              color: "#b0b7bd", // Gray color for indiscernables
            },
            {
              from: 2,
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
        return value < 0 ? `(${Math.ceil(Math.abs(value))})` : Math.ceil(value);
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
        offsetX: -25, // TM: Hacky (yet successful) attempt to achieve true center
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
      text:
        chartVersion === 0
          ? `${auth.cookie.user.viewingStoreLocation}'s Bi-Week Summary`
          : `${auth.cookie.user.viewingStoreLocation}'s Month-to-Date Summary`, // Title of the chart
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    annotations: {
      points: [
        {
          x: "Total",
          y: totalVariance,
          marker: {
            size: 0,
          },
          label: {
            borderColor: "#777",
            borderWidth: 1.5,
            offsetY: -5,
            offsetX: -5,
            style: {
              fontSize: "12px",
              color: "#777",
              background: "#fff",
              fontWeight: "bold",
            },
            text: totalVariance,
          },
        },
      ],
    },
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
    <div className=" bg-white shadow-md p-4 rounded-lg w-3/4">
      <div className=" w-full">
        <Chart options={options} series={series} type="bar" height={350} />

        {chartVersion === 0 && (
          <div className="flex flex-row justify-end items-center">
            <p className="mr-2 text-xs font-bold text-gray-500 ">
              Toggle Month-to-Date
            </p>
            <ToggleRight
              className="h-8 w-8 mr-4 text-gray-500 cursor-pointer"
              onClick={() => setChartVersion(1)}
            />
          </div>
        )}
        {chartVersion === 1 && (
          <div className="flex flex-row justify-end items-center">
            <p className="mr-2 text-xs font-bold text-gray-500 ">
              Toggle Bi-Week
            </p>
            <ToggleLeft
              className="h-8 w-8 mr-4 text-gray-500 cursor-pointer"
              onClick={() => setChartVersion(0)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OSBarChart;
