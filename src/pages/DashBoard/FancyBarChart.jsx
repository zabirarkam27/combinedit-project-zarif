import { memo, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FancyBarChart = ({ labels = [], values = [] }) => {
  // Memoize data to prevent unnecessary recalculations
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Sales",
          data: values,
          backgroundColor: "rgba(59,130,246,0.8)", // blue-500
          borderRadius: 20,
          borderSkipped: false,
        },
      ],
    }),
    [labels, values]
  );

  // Memoize options
  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: {
            color: "#374151",
            callback: function (value) {
              return labels[value]?.substring(0, 3) || "";
            },
            maxRotation: 0,
            minRotation: 0,
          },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
        },
      },
    }),
    [labels]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
};

export default memo(FancyBarChart);
