import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import Fuse from "fuse.js";

// বাংলাদেশের ৬৪ জেলা
const districts = [
  "bagerhat","bandarban","barguna","barisal","bhola","bogura","brahmanbaria","chandpur","chapainawabganj","chattogram",
  "chuadanga","cox's bazar","cumilla","dhaka","dinajpur","faridpur","feni","gaibandha","gazipur","gopalganj","habiganj",
  "jamalpur","jashore","jhalokati","jhenaidah","joypurhat","khagrachhari","khulna","kishoreganj","kurigram","kushtia",
  "lakshmipur","lalmonirhat","madaripur","magura","manikganj","meherpur","moulvibazar","munshiganj","mymensingh","naogaon",
  "narail","narayanganj","narsingdi","netrokona","nilphamari","noakhali","pabna","panchagarh","patuakhali","pirojpur",
  "rajbari","rajshahi","rangamati","rangpur","satkhira","shariatpur","sherpur","sirajganj","sunamganj","sylhet","tangail","thakurgaon"
];

// Fuse.js config
const fuse = new Fuse(districts, {
  includeScore: true,
  threshold: 0.4, 
});

const findDistrict = (address) => {
  if (!address) return null;
  const lowerAddress = address.toLowerCase();

  const exact = districts.find((d) => lowerAddress.includes(d));
  if (exact) return exact;

  const result = fuse.search(lowerAddress);
  if (result.length > 0) {
    return result[0].item; 
  }

  return null;
};

const FancyCityBarChart = ({ orders = [] }) => {
  // জেলা অনুযায়ী কাউন্ট
  const cityCount = {};
    orders.forEach((order) => {
    const district = findDistrict(order.address);
    if (district) {
      cityCount[district] = (cityCount[district] || 0) + 1;
    }
  });

  // sort + top 5
  const sortedCities = Object.entries(cityCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg">
      <h2 className="text-sm font-semibold mb-3">Top sales by City</h2>
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

