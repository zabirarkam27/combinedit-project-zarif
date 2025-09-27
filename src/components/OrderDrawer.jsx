const OrderDrawer = ({
  cartItems = [],
  selectedProduct = null,
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* background overlay */}
      <div className="flex-1 bg-black/50" onClick={closeDrawer}></div>

      {/* drawer content */}
      <div className="flex flex-col gap-4 p-4 w-full md:w-96 min-h-full bg-white text-base-content shadow-lg overflow-y-auto px-4 md:px-8 relative">
        {/* close button */}
        <button onClick={closeDrawer} className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#398881] text-[#398881] hover:bg-[#398881] hover:text-white transition font-black hover:cursor-pointer absolute top-4 right-4 md:right-8" > X </button>

        <h2 className="text-left text-[#398881] font-semibold">Bills</h2>

        {/* multiple cart items এর ক্ষেত্রে */}
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-4 mb-5">
            {cartItems.map((item) => {
              const itemId = item._id || item.id;
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={itemId}
                  className="flex items-center gap-2 md:gap-3  pb-3"
                >
                  <img
                    src={
                      Array.isArray(item.images)
                        ? item.images[0]
                        : item.images || item.thumbnail
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border border-[#009e8e]"
                  />
                  <div className="flex justify-between w-full gap-4">
                    <div className="text-left text-sm">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-gray-600">
                        {item.weight || item.volume}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-600">
                        ৳{itemTotal}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                        <button
                          onClick={() => decreaseQuantity(itemId)}
                          className="px-2 py-0 rounded text-white bg-gradient-to-r from-gray-800 to-gray-400 hover:from-gray-500 hover:to-gray-900"
                        >
                          -
                        </button>
                        <span className="font-normal">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(itemId)}
                          className="px-2 py-0 rounded text-white bg-gradient-to-l from-[#009e8e] to-[#00bfa5] hover:from-[#00bfa5] hover:to-[#007f6e]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* single product এর ক্ষেত্রে */
          selectedProduct && (
            <div className="flex items-center gap-2 md:gap-3 mb-5">
              <img
                src={
                  selectedProduct.image ||
                  selectedProduct.thumbnail ||
                  selectedProduct.images
                }
                alt={selectedProduct.name}
                className="w-16 h-16 object-cover rounded border border-[#009e8e]"
              />
              <div className="flex justify-between w-full gap-4">
                <div className="text-left text-sm">
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-xs text-gray-600">
                    {selectedProduct.weight || selectedProduct.volume}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-md font-semibold text-gray-600">
                    ৳{productTotal}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                    <button
                      onClick={decreaseQuantity}
                      className="px-2 py-0 bg-gray-700 rounded text-white "
                    >
                      -
                    </button>
                    <span className="font-normal">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="px-2 py-0 bg-[#009e8e] rounded text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Price section */}
        <div className="space-y-1 mb-3">
          <div className="text-right text-xs text-gray-500 flex justify-between pl-2">
            <p>Sub Total</p>
            <p>TK {productTotal}</p>
          </div>
          <div className="text-right text-xs text-gray-500 flex justify-between pl-2">
            <p>Delivery Charge</p>
            <p>TK {Number(orderInfo.shippingCharge)}</p>
          </div>
          <div className="border-b-2 border-gray-400 border-dotted"></div>
          <div className="text-right font-semibold text-base flex justify-between pl-2">
            <p>Total</p>
            <p>TK {grandTotal}</p>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name input */}
          <div className="flex items-center border border-[#398881] rounded-md overflow-hidden">
            <div className="bg-[#398881] flex items-center justify-center px-3 py-1">
              <img src="/input-phone-icon.png" alt="icon" className="w-6 h-6" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={orderInfo.name}
              onChange={handleOrderChange}
              className="w-full bg-white px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#398881] focus:ring-opacity-50 placeholder:text-xs text-sm"
              required
            />
          </div>

          {/* Phone input */}
          <div className="flex items-center border border-[#398881] rounded-md overflow-hidden">
            <div className="bg-[#398881] flex items-center justify-center px-3 py-1">
              <img src="/input-phone-icon.png" alt="icon" className="w-6 h-6" />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={orderInfo.phone}
              onChange={handleOrderChange}
              className="w-full bg-white px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#398881] focus:ring-opacity-50 placeholder:text-xs text-sm"
              required
            />
          </div>

          {/* Address Input */}
          <div className="flex border border-[#398881] rounded-md overflow-hidden">
            <div className="bg-[#398881] flex items-center justify-center px-3 self-stretch">
              <img src="/input-phone-icon.png" alt="icon" className="w-6 h-6" />
            </div>
            <textarea
              name="address"
              placeholder="Delivery Address *"
              value={orderInfo.address}
              onChange={handleOrderChange}
              rows="1"
              className="flex-1 bg-white px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-[#398881] focus:ring-opacity-50 placeholder:text-xs text-sm"
              required
            />
          </div>

          {/* Note input */}
          <div className="flex border border-[#398881] rounded-md overflow-hidden">
            <div className="bg-[#398881] flex items-center justify-center px-3 self-stretch">
              <img src="/input-phone-icon.png" alt="icon" className="w-6 h-6" />
            </div>
            <textarea
              name="note"
              placeholder="Note"
              value={orderInfo.note}
              onChange={handleOrderChange}
              rows="1"
              className="flex-1 bg-white px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-[#398881] focus:ring-opacity-50 placeholder:text-xs text-sm"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1 mt-6">
            <label className="block mb-2 font-semibold text-sm text-left">
              Payment Method
            </label>
            <div className="text-[11px] flex gap-4 flex-wrap">
              {["Cash on Delivery", "Bkash", "Rocket"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={orderInfo.paymentMethod === method}
                    onChange={handleOrderChange}
                    className="appearance-none w-4 h-4 border border-[#398881] rounded-none checked:bg-[#398881]"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {/* Shipping Charge */}
          <div className="space-y-1 mb-6 mt-4">
            <label className="block mb-2 font-semibold text-sm text-left">
              Shipping Charge
            </label>
            <div className="flex gap-2 flex-wrap text-[11px]">
              {[70, 120].map((val) => (
                <label key={val} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shippingCharge"
                    value={val}
                    checked={Number(orderInfo.shippingCharge) === val}
                    onChange={handleOrderChange}
                    className="appearance-none w-4 h-4 border border-[#398881] rounded-none checked:bg-[#398881]"
                  />
                  {val === 70
                    ? "Inside Dhaka (BDT 70)"
                    : "Outside Dhaka (BDT 120)"}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out border-0 hover:bg-right shadow-none hover:scale-105 w-full text-white font-semibold py-2 rounded-md text-sm"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderDrawer;
