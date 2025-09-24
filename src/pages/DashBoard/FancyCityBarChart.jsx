import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import Fuse from "fuse.js";

const districts = [
  "bagerhat",
  "bandarban",
  "barguna",
  "barisal",
  "bhola",
  "bogura",
  "brahmanbaria",
  "chandpur",
  "chapainawabganj",
  "chattogram",
  "chuadanga",
  "cox's bazar",
  "cumilla",
  "dhaka",
  "dinajpur",
  "faridpur",
  "feni",
  "gaibandha",
  "gazipur",
  "gopalganj",
  "habiganj",
  "jamalpur",
  "jashore",
  "jhalokati",
  "jhenaidah",
  "joypurhat",
  "khagrachhari",
  "khulna",
  "kishoreganj",
  "kurigram",
  "kushtia",
  "lakshmipur",
  "lalmonirhat",
  "madaripur",
  "magura",
  "manikganj",
  "meherpur",
  "moulvibazar",
  "munshiganj",
  "mymensingh",
  "naogaon",
  "narail",
  "narayanganj",
  "narsingdi",
  "netrokona",
  "nilphamari",
  "noakhali",
  "pabna",
  "panchagarh",
  "patuakhali",
  "pirojpur",
  "rajbari",
  "rajshahi",
  "rangamati",
  "rangpur",
  "satkhira",
  "shariatpur",
  "sherpur",
  "sirajganj",
  "sunamganj",
  "sylhet",
  "tangail",
  "thakurgaon",
];

// Fuse.js একবার initialization
const fuse = new Fuse(districts, {
  includeScore: true,
  threshold: 0.4,
});

// ফাংশন district খুঁজতে
const findDistrict = (address) => {
  if (!address) return null;
  const lowerAddress = address.toLowerCase();

  const exact = districts.find((d) => lowerAddress.includes(d));
  if (exact) return exact;

  const result = fuse.search(lowerAddress);
  return result.length > 0 ? result[0].item : null;
};

const FancyCityBarChart = ({ orders = [] }) => {
  // orders থেকে memoized top 5 city count
  const sortedCities = useMemo(() => {
    const cityCount = {};

    orders.forEach((order) => {
      const district = findDistrict(order.address);
      if (district) cityCount[district] = (cityCount[district] || 0) + 1;
    });

    return Object.entries(cityCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg">
      <h2 className="text-sm font-semibold mb-3">Top Sales by City</h2>
      <ResponsiveContainer width="100%" height={290}>
        <BarChart
          data={sortedCities}
          layout="vertical"
          margin={{ left: 30, right: 30 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]}>
            <LabelList
              dataKey="count"
              position="right"
              style={{ fontSize: 12, fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FancyCityBarChart;
