const productImage = (product) => {
  if (!product) return "";
  if (product.selectedOptions?.image) return product.selectedOptions.image;
  if (product.selectedImage) return product.selectedImage;
  if (Array.isArray(product.images)) return product.images[0];
  return product.image || product.thumbnail || product.images;
};

const itemPrice = (item) => Number(item?.discountPrice || item?.price || 0);

const SelectedOptionBadges = ({ item }) => {
  const selectedOptions = item?.selectedOptions || {};
  if (!selectedOptions.size && !selectedOptions.color) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {selectedOptions.size && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
          Size: {selectedOptions.size}
        </span>
      )}
      {selectedOptions.color && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
          <span
            className="h-2 w-2 rounded-full border border-black/10"
            style={{ backgroundColor: selectedOptions.color }}
          />
          {selectedOptions.color}
        </span>
      )}
    </div>
  );
};

const FieldIcon = () => (
  <div className="theme-secondary-bg flex items-center justify-center px-3 self-stretch">
    <img src="/input-phone-icon.png" alt="" className="w-6 h-6" />
  </div>
);

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
      <button
        type="button"
        aria-label="Close order drawer"
        className="flex-1 bg-black/50"
        onClick={closeDrawer}
      />

      <div className="flex flex-col gap-4 p-4 w-full md:w-96 min-h-full bg-white text-base-content shadow-lg overflow-y-auto px-4 md:px-8 relative">
        <button
          type="button"
          onClick={closeDrawer}
          className="w-7 h-7 flex items-center justify-center rounded-full border-2 theme-border text-[var(--theme-secondary)] hover:bg-[var(--theme-secondary)] hover:text-white transition font-black hover:cursor-pointer absolute top-4 right-4 md:right-8"
        >
          X
        </button>

        <h2 className="text-left text-[var(--theme-secondary)] font-semibold">
          Bills
        </h2>

        {cartItems.length > 0 ? (
          <div className="space-y-4 mb-5">
            {cartItems.map((item) => {
              const itemId = item.cartKey || item._id || item.id;
              const itemTotal = itemPrice(item) * item.quantity;

              return (
                <div key={itemId} className="flex items-center gap-2 md:gap-3 pb-3">
                  <img
                    src={productImage(item)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border theme-border"
                  />
                  <div className="flex justify-between w-full gap-4">
                    <div className="text-left text-sm">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-gray-600">
                        {item.weight || item.volume}
                      </p>
                      <SelectedOptionBadges item={item} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-600">
                        ৳{itemTotal}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(itemId)}
                          className="px-2 py-0 rounded text-white bg-gradient-to-r from-gray-800 to-gray-400 hover:from-gray-500 hover:to-gray-900"
                        >
                          -
                        </button>
                        <span className="font-normal">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(itemId)}
                          className="px-2 py-0 rounded text-white theme-gradient theme-gradient-hover"
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
          selectedProduct && (
            <div className="flex items-center gap-2 md:gap-3 mb-5">
              <img
                src={productImage(selectedProduct)}
                alt={selectedProduct.name}
                className="w-16 h-16 object-cover rounded border theme-border"
              />
              <div className="flex justify-between w-full gap-4">
                <div className="text-left text-sm">
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-xs text-gray-600">
                    {selectedProduct.weight || selectedProduct.volume}
                  </p>
                  <SelectedOptionBadges item={selectedProduct} />
                </div>
                <div className="text-right">
                  <p className="text-md font-semibold text-gray-600">
                    ৳{productTotal}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="px-2 py-0 bg-gray-700 rounded text-white"
                    >
                      -
                    </button>
                    <span className="font-normal">{quantity}</span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="px-2 py-0 theme-primary-bg rounded text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        <div className="space-y-1 mb-3">
          <div className="text-right text-xs text-gray-500 flex justify-between pl-2">
            <p>Sub Total</p>
            <p>TK {productTotal}</p>
          </div>
          <div className="text-right text-xs text-gray-500 flex justify-between pl-2">
            <p>Delivery Charge</p>
            <p>TK {Number(orderInfo.shippingCharge)}</p>
          </div>
          <div className="border-b-2 border-gray-400 border-dotted" />
          <div className="text-right font-semibold text-base flex justify-between pl-2">
            <p>Total</p>
            <p>TK {grandTotal}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center border theme-border rounded-md overflow-hidden">
            <FieldIcon />
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={orderInfo.name}
              onChange={handleOrderChange}
              className="w-full bg-white px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--theme-secondary)] focus:ring-opacity-50 placeholder:text-xs text-sm"
              required
            />
          </div>

          <div className="flex items-center border theme-border rounded-md overflow-hidden">
            <FieldIcon />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={orderInfo.phone}
              onChange={handleOrderChange}
              className="w-full bg-white px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--theme-secondary)] focus:ring-opacity-50 placeholder:text-xs text-sm"
              required
            />
          </div>

          <div className="flex border theme-border rounded-md overflow-hidden">
            <FieldIcon />
            <textarea
              name="address"
              placeholder="Delivery Address *"
              value={orderInfo.address}
              onChange={handleOrderChange}
              rows="1"
              className="flex-1 bg-white px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-[var(--theme-secondary)] focus:ring-opacity-50 placeholder:text-xs text-sm"
              required
            />
          </div>

          <div className="flex border theme-border rounded-md overflow-hidden">
            <FieldIcon />
            <textarea
              name="note"
              placeholder="Note"
              value={orderInfo.note}
              onChange={handleOrderChange}
              rows="1"
              className="flex-1 bg-white px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-[var(--theme-secondary)] focus:ring-opacity-50 placeholder:text-xs text-sm"
            />
          </div>

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
                    className="appearance-none w-4 h-4 border theme-border rounded-none checked:bg-[var(--theme-secondary)]"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

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
                    className="appearance-none w-4 h-4 border theme-border rounded-none checked:bg-[var(--theme-secondary)]"
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
            className="theme-gradient theme-gradient-hover border-0 shadow-none hover:scale-105 w-full text-white font-semibold py-2 rounded-md text-sm flex items-center justify-center gap-4 mb-4"
          >
            <p>Confirm Order</p>
            <p>TK {grandTotal}</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderDrawer;
