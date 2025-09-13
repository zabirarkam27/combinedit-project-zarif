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

const FancyBarChart = ({ labels, values }) => {
  const data = {
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
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          color: "#374151",
          callback: (value) => labels[value].substring(0, 3),
          maxRotation: 0,
          minRotation: 0,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* key + redraw = canvas conflict fix */}
      <Bar key={JSON.stringify(values)} data={data} options={options} redraw />
    </div>
  );
};

export default FancyBarChart;
