import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  Package,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";

import { useOrdersContext } from "../../context/OrdersContext";
import { getProducts } from "../../services/products";
import { downloadCsv } from "../../utils/csv";

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const districtCatalog = [
  { name: "Bagerhat", aliases: ["bagerhat", "বাগেরহাট"] },
  { name: "Bandarban", aliases: ["bandarban", "বান্দরবান"] },
  { name: "Barguna", aliases: ["barguna", "বরগুনা"] },
  { name: "Barishal", aliases: ["barishal", "barisal", "বরিশাল"] },
  { name: "Bhola", aliases: ["bhola", "ভোলা"] },
  { name: "Bogura", aliases: ["bogura", "bogra", "বগুড়া", "বগুড়া"] },
  { name: "Brahmanbaria", aliases: ["brahmanbaria", "brahman bariya", "ব্রাহ্মণবাড়িয়া", "ব্রাহ্মণবাড়িয়া"] },
  { name: "Chandpur", aliases: ["chandpur", "চাঁদপুর"] },
  { name: "Chapainawabganj", aliases: ["chapainawabganj", "chapai nawabganj", "চাঁপাইনবাবগঞ্জ"] },
  { name: "Chattogram", aliases: ["chattogram", "chittagong", "চট্টগ্রাম"] },
  { name: "Chuadanga", aliases: ["chuadanga", "চুয়াডাঙ্গা", "চুয়াডাঙ্গা"] },
  { name: "Cox's Bazar", aliases: ["cox's bazar", "cox bazar", "coxsbazar", "কক্সবাজার"] },
  { name: "Cumilla", aliases: ["cumilla", "comilla", "কুমিল্লা"] },
  { name: "Dhaka", aliases: ["dhaka", "ঢাকা"] },
  { name: "Dinajpur", aliases: ["dinajpur", "দিনাজপুর"] },
  { name: "Faridpur", aliases: ["faridpur", "ফরিদপুর"] },
  { name: "Feni", aliases: ["feni", "ফেনী"] },
  { name: "Gaibandha", aliases: ["gaibandha", "গাইবান্ধা"] },
  { name: "Gazipur", aliases: ["gazipur", "গাজীপুর"] },
  { name: "Gopalganj", aliases: ["gopalganj", "গোপালগঞ্জ"] },
  { name: "Habiganj", aliases: ["habiganj", "হবিগঞ্জ"] },
  { name: "Jamalpur", aliases: ["jamalpur", "জামালপুর"] },
  { name: "Jashore", aliases: ["jashore", "jessore", "যশোর"] },
  { name: "Jhalokathi", aliases: ["jhalokathi", "jhalakathi", "ঝালকাঠি"] },
  { name: "Jhenaidah", aliases: ["jhenaidah", "jhenaidha", "ঝিনাইদহ"] },
  { name: "Joypurhat", aliases: ["joypurhat", "jaipurhat", "জয়পুরহাট", "জয়পুরহাট"] },
  { name: "Khagrachhari", aliases: ["khagrachhari", "khagrachari", "খাগড়াছড়ি", "খাগড়াছড়ি"] },
  { name: "Khulna", aliases: ["khulna", "খুলনা"] },
  { name: "Kishoreganj", aliases: ["kishoreganj", "kishorganj", "কিশোরগঞ্জ"] },
  { name: "Kurigram", aliases: ["kurigram", "কুড়িগ্রাম", "কুড়িগ্রাম"] },
  { name: "Kushtia", aliases: ["kushtia", "কুষ্টিয়া", "কুষ্টিয়া"] },
  { name: "Lakshmipur", aliases: ["lakshmipur", "laxmipur", "লক্ষ্মীপুর"] },
  { name: "Lalmonirhat", aliases: ["lalmonirhat", "lalmonir haat", "লালমনিরহাট"] },
  { name: "Madaripur", aliases: ["madaripur", "মাদারীপুর"] },
  { name: "Magura", aliases: ["magura", "মাগুরা"] },
  { name: "Manikganj", aliases: ["manikganj", "মানিকগঞ্জ"] },
  { name: "Meherpur", aliases: ["meherpur", "মেহেরপুর"] },
  { name: "Moulvibazar", aliases: ["moulvibazar", "moulvi bazar", "maulvibazar", "মৌলভীবাজার"] },
  { name: "Munshiganj", aliases: ["munshiganj", "munshigonj", "মুন্সিগঞ্জ"] },
  { name: "Mymensingh", aliases: ["mymensingh", "mymensing", "ময়মনসিংহ", "ময়মনসিংহ"] },
  { name: "Naogaon", aliases: ["naogaon", "নওগাঁ"] },
  { name: "Narail", aliases: ["narail", "নড়াইল", "নড়াইল"] },
  { name: "Narayanganj", aliases: ["narayanganj", "narayangonj", "নারায়ণগঞ্জ", "নারায়ণগঞ্জ"] },
  { name: "Narsingdi", aliases: ["narsingdi", "narsinghdi", "নরসিংদী"] },
  { name: "Natore", aliases: ["natore", "নাটোর"] },
  { name: "Netrokona", aliases: ["netrokona", "netrakona", "নেত্রকোনা"] },
  { name: "Nilphamari", aliases: ["nilphamari", "নীলফামারী"] },
  { name: "Noakhali", aliases: ["noakhali", "নোয়াখালী", "নোয়াখালী"] },
  { name: "Pabna", aliases: ["pabna", "পাবনা"] },
  { name: "Panchagarh", aliases: ["panchagarh", "ponchogor", "পঞ্চগড়", "পঞ্চগড়"] },
  { name: "Patuakhali", aliases: ["patuakhali", "পটুয়াখালী", "পটুয়াখালী"] },
  { name: "Pirojpur", aliases: ["pirojpur", "পিরোজপুর"] },
  { name: "Rajbari", aliases: ["rajbari", "রাজবাড়ী", "রাজবাড়ী"] },
  { name: "Rajshahi", aliases: ["rajshahi", "রাজশাহী"] },
  { name: "Rangamati", aliases: ["rangamati", "rangamati hill", "রাঙ্গামাটি"] },
  { name: "Rangpur", aliases: ["rangpur", "রংপুর"] },
  { name: "Satkhira", aliases: ["satkhira", "satkhira", "সাতক্ষীরা"] },
  { name: "Shariatpur", aliases: ["shariatpur", "shariyatpur", "শরীয়তপুর", "শরিয়তপুর"] },
  { name: "Sherpur", aliases: ["sherpur", "শেরপুর"] },
  { name: "Sirajganj", aliases: ["sirajganj", "sirajgonj", "সিরাজগঞ্জ"] },
  { name: "Sunamganj", aliases: ["sunamganj", "sunamgonj", "সুনামগঞ্জ"] },
  { name: "Sylhet", aliases: ["sylhet", "silet", "সিলেট"] },
  { name: "Tangail", aliases: ["tangail", "টাঙ্গাইল"] },
  { name: "Thakurgaon", aliases: ["thakurgaon", "thakurgoan", "ঠাকুরগাঁও"] },
];

const normalizeAddressPart = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u200c\u200d]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const compactText = (value = "") => normalizeAddressPart(value).replace(/\s+/g, "");

const districtMatchers = districtCatalog.map((district) => ({
  ...district,
  aliases: [district.name, ...district.aliases].map((alias) => normalizeAddressPart(alias)),
  compactAliases: [district.name, ...district.aliases].map((alias) => compactText(alias)),
}));

const editDistance = (source, target) => {
  if (source === target) return 0;
  if (!source) return target.length;
  if (!target) return source.length;

  const previous = Array.from({ length: target.length + 1 }, (_, index) => index);
  const current = Array(target.length + 1).fill(0);

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    current[0] = sourceIndex;
    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const cost = source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1;
      current[targetIndex] = Math.min(
        current[targetIndex - 1] + 1,
        previous[targetIndex] + 1,
        previous[targetIndex - 1] + cost
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[target.length];
};

const isCloseDistrictMatch = (candidate, alias) => {
  if (!candidate || !alias || Math.abs(candidate.length - alias.length) > 2) return false;
  const distance = editDistance(candidate, alias);
  const tolerance = alias.length <= 4 ? 1 : alias.length <= 8 ? 2 : 3;
  return distance <= tolerance && distance / alias.length <= 0.28;
};

const statusMeta = {
  pending: { label: "Pending", color: "#f59e0b" },
  processing: { label: "Processing", color: "#2563eb" },
  pickup: { label: "Pickup", color: "#7c3aed" },
  completed: { label: "Completed", color: "#16a34a" },
  cancelled: { label: "Cancelled", color: "#dc2626" },
  unknown: { label: "Other", color: "#64748b" },
};

const getStatus = (order) =>
  String(order?.status?.status || order?.status || "unknown").toLowerCase();

const formatCurrency = (value) =>
  `BDT ${Math.round(Number(value) || 0).toLocaleString("en-US")}`;

const toDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const findDistrict = (address = "") => {
  const normalizedAddress = normalizeAddressPart(address);
  if (!normalizedAddress) return null;

  const compactAddress = compactText(address);
  const paddedAddress = ` ${normalizedAddress} `;

  const exactMatch = districtMatchers.find((district) =>
    district.aliases.some((alias) => paddedAddress.includes(` ${alias} `)) ||
    district.compactAliases.some((alias) => alias.length > 4 && compactAddress.includes(alias))
  );

  if (exactMatch) return exactMatch.name;

  const tokens = normalizedAddress.split(" ").filter(Boolean);
  const candidates = [];
  tokens.forEach((_, index) => {
    for (let size = 1; size <= 3; size += 1) {
      const phrase = tokens.slice(index, index + size).join(" ");
      if (phrase) candidates.push(phrase);
    }
  });

  const fuzzyMatch = districtMatchers.find((district) =>
    district.aliases.some((alias) =>
      candidates.some((candidate) => isCloseDistrictMatch(candidate, alias))
    )
  );

  return fuzzyMatch?.name || null;
};

const comparePercent = (current, previous) => {
  if (!previous) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const DashboardTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-black text-slate-950">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="font-semibold text-slate-600">
          {item.name}:{" "}
          {item.dataKey === "revenue"
            ? formatCurrency(item.value)
            : Number(item.value || 0).toLocaleString("en-US")}
        </p>
      ))}
    </div>
  );
};

const KpiCard = ({ title, value, subtitle, change, icon: Icon, tone = "green" }) => {
  const positive = change >= 0;
  const toneClass = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  }[tone];

  return (
    <article className="rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <h3 className="mt-2 break-words text-xl font-black text-slate-950 sm:text-2xl">{value}</h3>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${toneClass}`}>
          <Icon size={20} />
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2 text-xs font-bold xs:flex-row xs:items-center xs:justify-between">
        <span className="text-slate-500">{subtitle}</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
            positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(change || 0).toFixed(1)}%
        </span>
      </div>
    </article>
  );
};

const EmptyChartState = ({ label }) => (
  <div className="grid h-52 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center sm:h-64 sm:rounded-3xl">
    <div>
      <p className="font-black text-slate-700">{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">
        Data will appear after orders are placed.
      </p>
    </div>
  </div>
);

const Stats = () => {
  const { orders = [] } = useOrdersContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;

    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (alive) setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load dashboard products:", error);
        if (alive) setProducts([]);
      }
    };

    fetchProducts();
    return () => {
      alive = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth > 0 ? currentMonth - 1 : 11;

    const monthly = monthLabels.map((month) => ({
      month,
      revenue: 0,
      orders: 0,
      completed: 0,
    }));
    const statusCounts = {};
    const cityCounts = {};
    const daily = {};
    const customers = new Set();

    let totalRevenue = 0;
    let currentRevenue = 0;
    let previousRevenue = 0;
    let currentOrders = 0;
    let previousOrders = 0;

    orders.forEach((order) => {
      const date = toDate(order.createdAt);
      const total = Number(order.grandTotal || 0);
      const status = getStatus(order);
      const monthIndex = date?.getMonth();

      totalRevenue += total;
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      if (monthIndex !== undefined) {
        monthly[monthIndex].revenue += total;
        monthly[monthIndex].orders += 1;
        if (status === "completed") monthly[monthIndex].completed += 1;
        if (monthIndex === currentMonth) {
          currentRevenue += total;
          currentOrders += 1;
        }
        if (monthIndex === previousMonth) {
          previousRevenue += total;
          previousOrders += 1;
        }
      }

      const day = date?.toISOString().slice(0, 10);
      if (day) {
        daily[day] = daily[day] || { Date: day, Orders: 0, Revenue: 0 };
        daily[day].Orders += 1;
        daily[day].Revenue += total;
      }

      const district = findDistrict(order.address);
      if (district) cityCounts[district] = (cityCounts[district] || 0) + 1;

      const customerKey = order.phone || order.email || order.name;
      if (customerKey) customers.add(customerKey);
    });

    const completedOrders = statusCounts.completed || 0;
    const cancelledOrders = statusCounts.cancelled || 0;
    const activeOrders = orders.length - completedOrders - cancelledOrders;
    const lowStockProducts = products.filter(
      (product) => product?.inStock === false || Number(product?.stockQuantity || 0) === 0
    ).length;

    const statusData = Object.entries(statusMeta)
      .map(([key, meta]) => ({
        key,
        name: meta.label,
        value: statusCounts[key] || 0,
        color: meta.color,
      }))
      .filter((item) => item.value > 0);

    const cityData = Object.entries(cityCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const salesTrend = Object.values(daily)
      .sort((a, b) => a.Date.localeCompare(b.Date))
      .slice(-14)
      .map((item) => ({
        month: new Date(`${item.Date}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: item.Revenue,
        orders: item.Orders,
        completed: 0,
      }));

    const recentOrders = [...orders]
      .sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0))
      .slice(0, 5);

    return {
      totalRevenue,
      activeOrders,
      completedOrders,
      cancelledOrders,
      customerCount: customers.size,
      productCount: products.length,
      lowStockProducts,
      revenueChange: comparePercent(currentRevenue, previousRevenue),
      orderChange: comparePercent(currentOrders, previousOrders),
      completionRate: orders.length ? (completedOrders / orders.length) * 100 : 0,
      cancelRate: orders.length ? (cancelledOrders / orders.length) * 100 : 0,
      monthly: salesTrend.length ? salesTrend : monthly,
      salesTrend,
      statusData,
      cityData,
      dailyCsv: Object.values(daily).sort((a, b) => a.Date.localeCompare(b.Date)),
      recentOrders,
    };
  }, [orders, products]);

  const exportDailySales = () => {
    downloadCsv("daily-sales.csv", analytics.dailyCsv);
  };

  const exportSalesByProduct = () => {
    const productTotals = {};

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productName || item.name || item.productId || "Unknown";
        const current = productTotals[key] || {
          Product: key,
          Quantity: 0,
          Revenue: 0,
        };
        current.Quantity += Number(item.quantity || 0);
        current.Revenue += Number(item.finalPrice || item.unitPrice || 0);
        productTotals[key] = current;
      });
    });

    downloadCsv("sales-by-product.csv", Object.values(productTotals));
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          subtitle="Compared with last month"
          change={analytics.revenueChange}
          icon={Wallet}
          tone="green"
        />
        <KpiCard
          title="Active Orders"
          value={analytics.activeOrders.toLocaleString("en-US")}
          subtitle="Open orders right now"
          change={analytics.orderChange}
          icon={ShoppingBag}
          tone="blue"
        />
        <KpiCard
          title="Completion Rate"
          value={`${analytics.completionRate.toFixed(1)}%`}
          subtitle={`${analytics.completedOrders} completed orders`}
          change={analytics.completionRate}
          icon={CheckCircle2}
          tone="green"
        />
        <KpiCard
          title="Catalog Health"
          value={analytics.productCount.toLocaleString("en-US")}
          subtitle={`${analytics.lowStockProducts} out of stock`}
          change={-analytics.lowStockProducts}
          icon={Package}
          tone={analytics.lowStockProducts ? "amber" : "green"}
        />
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
        <section className="min-w-0 rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--theme-primary)]">
                Revenue Trend
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Monthly sales performance
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={exportDailySales}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
              >
                <Download size={14} />
                Daily CSV
              </button>
              <button
                type="button"
                onClick={exportSalesByProduct}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-black text-white theme-gradient theme-gradient-hover"
              >
                <Download size={14} />
                Product CSV
              </button>
            </div>
          </div>

          <div className="h-[260px] min-w-0 sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthly} margin={{ left: -18, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--theme-primary)" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="var(--theme-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip content={<DashboardTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--theme-primary)"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 6, strokeWidth: 3, stroke: "#ffffff" }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--theme-primary)]">
            Order Mix
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Status overview</h2>
          {analytics.statusData.length ? (
            <div className="mt-4">
              <div className="relative h-52 sm:h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={3}
                    >
                      {analytics.statusData.map((entry) => (
                        <Cell key={entry.key} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                  <div>
                    <p className="text-2xl font-black text-slate-950">{orders.length}</p>
                    <p className="text-xs font-bold text-slate-500">Orders</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                {analytics.statusData.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-sm font-bold">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="text-slate-950">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyChartState label="No order statuses yet" />
          )}
        </section>
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(320px,0.55fr)_minmax(0,1.45fr)]">
        <section className="min-w-0 rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--theme-primary)]">
                Delivery Areas
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Top districts</h2>
            </div>
            <MapPin className="text-[var(--theme-primary)]" size={22} />
          </div>

          {analytics.cityData.length ? (
            <div className="space-y-4">
              {analytics.cityData.map((city, index) => {
                const max = analytics.cityData[0]?.value || 1;
                const width = `${Math.max(8, (city.value / max) * 100)}%`;
                return (
                  <div key={city.name}>
                    <div className="mb-1 flex justify-between text-sm font-bold">
                      <span className="text-slate-700">{index + 1}. {city.name}</span>
                      <span className="text-slate-950">{city.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full theme-gradient" style={{ width }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyChartState label="No delivery area data" />
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--theme-primary)]">
                Recent Activity
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Latest orders</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black text-[var(--theme-primary)]">
              <Users size={14} />
              {analytics.customerCount} customers
            </span>
          </div>

          {analytics.recentOrders.length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              {analytics.recentOrders.map((order) => (
                <div
                  key={order.orderId || order._id || order.orderNumber}
                  className="grid min-w-0 gap-2 border-b border-slate-100 px-3 py-3 last:border-b-0 sm:px-4 md:grid-cols-[1fr_auto_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">
                      {order.name || "Unknown customer"}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {order.orderNumber || order.orderId || "No order id"}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black capitalize text-slate-700">
                    <Clock3 size={13} />
                    {getStatus(order)}
                  </span>
                  <p className="break-words text-sm font-black text-slate-950">
                    {formatCurrency(order.grandTotal)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyChartState label="No recent orders" />
          )}

          {analytics.cancelRate > 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              Cancel rate is {analytics.cancelRate.toFixed(1)}%. Review cancelled orders for delivery or stock issues.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Stats;
