import design from "../styles/design";

const OrderDrawer = ({
  selectedProduct,
  isOpen,
  quantity,
  grandTotal,
  productTotal,
  closeDrawer,
  increaseQuantity,
  decreaseQuantity,
  handleOrderChange,
  handleSubmit,
  orderInfo,
}) => {
  if (!isOpen) return null; // শুধু drawer control

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={closeDrawer}></div>
      <div className="flex flex-col gap-4 p-4 w-72 sm:w-96 min-h-full bg-[#ccccb7] text-base-content shadow-lg overflow-y-auto">
        {/* 👉 যদি single product থাকে */}
        {selectedProduct && (
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.images}
              alt={selectedProduct.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-600">
                Product Total: BDT {productTotal}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={decreaseQuantity}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={orderInfo.name}
            onChange={handleOrderChange}
            className={design.inputs}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={orderInfo.phone}
            onChange={handleOrderChange}
            className={design.inputs}
            required
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={orderInfo.address}
            onChange={handleOrderChange}
            className={design.inputs}
            rows="3"
            required
          />
          <textarea
            name="note"
            placeholder="Note"
            value={orderInfo.note}
            onChange={handleOrderChange}
            className={design.inputs}
            rows="3"
          />

          <div className="space-y-1">
            <label className="font-semibold text-sm">Shipping Charge</label>
            <div className="flex gap-4 flex-wrap">
              {[70, 120].map((val) => (
                <label key={val} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shippingCharge"
                    value={val}
                    checked={Number(orderInfo.shippingCharge) === val}
                    onChange={handleOrderChange}
                    className="radio"
                  />
                  {val === 70
                    ? "Inside Dhaka (BDT 70)"
                    : "Outside Dhaka (BDT 120)"}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sm">Payment Method</label>
            <div className="flex gap-4 flex-wrap">
              {["Cash on Delivery", "Bkash", "Rocket"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={orderInfo.paymentMethod === method}
                    onChange={handleOrderChange}
                    className="radio"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <div className="text-right font-semibold text-lg">
            Total: BDT {grandTotal}
          </div>
          <button type="submit" className={`${design.buttons} w-full`}>
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderDrawer;
