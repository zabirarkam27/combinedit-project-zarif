import { Link } from "react-router-dom";

const DashItems = ({
  getOrderCountByStatus,
  getTodaysOrdersCount,
  getPendingOrdersCount,
  getProcessingOrdersCount,
  getCompletedOrdersCount,
  getCanceledOrdersCount,
}) => {
  // Safety function to handle any potential errors
  const safeGetCount = (fn, fallback = 0) => {
    try {
      return typeof fn === "function" ? fn() : fallback;
    } catch (error) {
      console.error("Error calling count function:", error);
      return fallback;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      <Link to="/dashboard/all-orders" className="tab-link">
        <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5346ba] to-[#755bb4]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#7a6ccb] to-[#997fc6] wave-clip w-full"></div>
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm">Total</p>
            <p className="text-sm">Orders</p>
            <h2 className="text-3xl font-bold">
              {safeGetCount(() => getOrderCountByStatus("all"))}
            </h2>
          </div>
        </div>
      </Link>

      {/* Tab for Today's Orders */}
      <Link to="/dashboard/all-orders" className="tab-link">
        <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9f5800] to-[#9f5800]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#b47b36] to-[#cb944c] wave-clip w-full"></div>
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm">Today's</p>
            <p className="text-sm">Orders</p>
            <h2 className="text-3xl font-bold">
              {safeGetCount(getTodaysOrdersCount)}
            </h2>
          </div>
        </div>
      </Link>

      {/* Tab for Pending Orders */}
      <Link to="/dashboard/pending-orders" className="tab-link">
        <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3e2857] to-[#684267]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#685779] to-[#8a6e87] wave-clip w-full"></div>
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm">Orders</p>
            <p className="text-sm">Pending</p>
            <h2 className="text-3xl font-bold">
              {safeGetCount(getPendingOrdersCount)}
            </h2>
          </div>
        </div>
      </Link>

      {/* Tab for Processing Orders */}
      <Link to="/dashboard/processing-orders" className="tab-link">
        <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6792d6] to-[#54ade7]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#82ade4] to-[#6ccff6] wave-clip w-full"></div>
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm">Orders</p>
            <p className="text-sm">Processing</p>
            <h2 className="text-3xl font-bold">
              {safeGetCount(getProcessingOrdersCount)}
            </h2>
          </div>
        </div>
      </Link>

      {/* Tab for Completed Orders */}
      <Link to="/dashboard/completed-orders" className="tab-link">
        <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-r from-[#58a834] to-[#94d456]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#80c15f] to-[#b8e57f] wave-clip w-full"></div>
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm">Orders</p>
            <p className="text-sm">Completed</p>
            <h2 className="text-3xl font-bold">
              {safeGetCount(getCompletedOrdersCount)}
            </h2>
          </div>
        </div>
      </Link>

      {/* Tab for Canceled Orders */}
      <Link to="/dashboard/canceled-orders" className="tab-link">
        <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-r from-[#733a86] to-[#a6326c]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#96609d] to-[#d45580] wave-clip w-full"></div>
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm">Orders</p>
            <p className="text-sm">Canceled</p>
            <h2 className="text-3xl font-bold">
              {safeGetCount(getCanceledOrdersCount)}
            </h2>
          </div>
        </div>
      </Link>
      <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-r from-[#526293] to-[#5c4d8b]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#7581ab] to-[#816a9f] wave-clip w-full"></div>
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">Total</p>
          <p className="text-sm">Products</p>
          <h2 className="text-3xl font-bold">11</h2>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-r from-[#02a9af] to-[#00c4ae]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#30c1bd] to-[#32d6bd] wave-clip w-full"></div>
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">Total</p>
          <p className="text-sm">Categories</p>
          <h2 className="text-3xl font-bold">11</h2>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-r from-[#df635f] to-[#f7a17f]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#e88c85] to-[#fcc39f] wave-clip w-full"></div>
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">Total</p>
          <p className="text-sm">Bands</p>
          <h2 className="text-3xl font-bold">11</h2>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d6ae7b] to-[#e3c295]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#e2c195] to-[#edd6b5] wave-clip w-full"></div>
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">Total</p>
          <p className="text-sm">Categories</p>
          <h2 className="text-3xl font-bold">11</h2>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-r from-[#e06b66] to-[#f8b28e]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#ea9d96] to-[#fdd3b0] wave-clip w-full"></div>
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">Total</p>
          <p className="text-sm">Customers</p>
          <h2 className="text-3xl font-bold">11</h2>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ef4062] to-[#f78271]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f67285] to-[#fdc093] wave-clip w-full"></div>
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">Total</p>
          <p className="text-sm">Out of Stock Products</p>
          <h2 className="text-3xl font-bold">11</h2>
        </div>
      </div>
    </div>
  );
};

export default DashItems;
