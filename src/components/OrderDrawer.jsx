import {
  CreditCard,
  MapPin,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";

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
    <div className="mt-2 flex flex-wrap gap-1.5">
      {selectedOptions.size && (
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200">
          Size: {selectedOptions.size}
        </span>
      )}
      {selectedOptions.color && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200">
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

const FieldShell = ({ icon: Icon, children }) => (
  <div className="flex items-stretch overflow-hidden rounded-2xl border border-[var(--theme-border-color)] bg-white shadow-sm transition focus-within:border-[var(--theme-primary)] focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/15">
    <div className="flex w-12 items-center justify-center bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
      <Icon size={18} />
    </div>
    {children}
  </div>
);

const QuantityStepper = ({ quantity, onIncrease, onDecrease }) => (
  <div className="inline-flex items-center rounded-full border border-slate-200 bg-white text-xs font-bold shadow-sm">
    <button
      type="button"
      onClick={onDecrease}
      className="grid h-7 w-7 place-items-center rounded-l-full text-slate-600 transition hover:bg-slate-100"
      aria-label="Decrease quantity"
    >
      <Minus size={13} />
    </button>
    <span className="min-w-7 text-center text-slate-900">{quantity}</span>
    <button
      type="button"
      onClick={onIncrease}
      className="grid h-7 w-7 place-items-center rounded-r-full text-[var(--theme-primary)] transition hover:bg-[var(--theme-muted-bg)]"
      aria-label="Increase quantity"
    >
      <Plus size={13} />
    </button>
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

  const hasCartItems = cartItems.length > 0;
  const singleItemTotal = selectedProduct ? itemPrice(selectedProduct) * quantity : 0;
  const displayItems = hasCartItems
    ? cartItems
    : selectedProduct
      ? [{ ...selectedProduct, quantity, lineTotal: singleItemTotal }]
      : [];

  const handleLineIncrease = (item) => {
    if (hasCartItems) {
      increaseQuantity(item.cartKey || item._id || item.id);
      return;
    }
    increaseQuantity();
  };

  const handleLineDecrease = (item) => {
    if (hasCartItems) {
      decreaseQuantity(item.cartKey || item._id || item.id);
      return;
    }
    decreaseQuantity();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm sm:items-center sm:px-5 sm:py-5">
      <button
        type="button"
        aria-label="Close checkout popup"
        className="absolute inset-0 cursor-default"
        onClick={closeDrawer}
      />

      <div className="relative flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-bottom))] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] ring-1 ring-white/40 sm:max-h-[94vh]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--theme-primary)]">
              Secure Checkout
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
              Confirm your order
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
            aria-label="Close checkout popup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)]">
          <section className="bg-[var(--theme-muted-bg)]/80 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white text-[var(--theme-primary)] shadow-sm">
                  <ShoppingBag size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-950">Order summary</h3>
                  <p className="text-xs font-medium text-slate-500">
                    {displayItems.length} item{displayItems.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[var(--theme-primary)] shadow-sm">
                BDT {grandTotal}
              </span>
            </div>

            <div className="space-y-3">
              {displayItems.map((item) => {
                const itemId = item.cartKey || item._id || item.id;
                const currentQuantity = item.quantity || quantity;
                const itemTotal = item.lineTotal || itemPrice(item) * currentQuantity;

                return (
                  <article
                    key={itemId}
                    className="flex gap-3 rounded-3xl border border-white bg-white/90 p-3 shadow-sm"
                  >
                    <img
                      src={productImage(item)}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-2xl border border-slate-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-950">
                            {item.name}
                          </h4>
                          {(item.weight || item.volume) && (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {item.weight || item.volume}
                            </p>
                          )}
                          <SelectedOptionBadges item={item} />
                        </div>
                        <p className="shrink-0 text-sm font-black text-slate-900">
                          BDT {itemTotal}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-500">
                          BDT {itemPrice(item)} each
                        </p>
                        <QuantityStepper
                          quantity={currentQuantity}
                          onDecrease={() => handleLineDecrease(item)}
                          onIncrease={() => handleLineIncrease(item)}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex justify-between text-sm font-semibold text-slate-500">
                <span>Sub total</span>
                <span>BDT {productTotal}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm font-semibold text-slate-500">
                <span>Delivery charge</span>
                <span>BDT {Number(orderInfo.shippingCharge)}</span>
              </div>
              <div className="my-4 border-t border-dashed border-slate-300" />
              <div className="flex justify-between text-lg font-black text-slate-950">
                <span>Total</span>
                <span>BDT {grandTotal}</span>
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-col bg-white">
            <div className="grid gap-4 p-4 sm:p-6">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-extrabold uppercase text-slate-500">
                    Name
                  </span>
                  <FieldShell icon={User}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={orderInfo.name}
                      onChange={handleOrderChange}
                      className="min-h-12 w-full bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                  </FieldShell>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-extrabold uppercase text-slate-500">
                    Phone
                  </span>
                  <FieldShell icon={Phone}>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={orderInfo.phone}
                      onChange={handleOrderChange}
                      className="min-h-12 w-full bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                  </FieldShell>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase text-slate-500">
                  Delivery address
                </span>
                <FieldShell icon={MapPin}>
                  <textarea
                    name="address"
                    placeholder="House, road, area, city"
                    value={orderInfo.address}
                    onChange={handleOrderChange}
                    rows="3"
                    className="w-full resize-none bg-transparent px-3 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                </FieldShell>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase text-slate-500">
                  Note
                </span>
                <FieldShell icon={MessageSquare}>
                  <textarea
                    name="note"
                    placeholder="Optional delivery note"
                    value={orderInfo.note}
                    onChange={handleOrderChange}
                    rows="2"
                    className="w-full resize-none bg-transparent px-3 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </FieldShell>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase text-slate-500">
                    <CreditCard size={15} />
                    Payment
                  </div>
                  <div className="grid gap-2">
                    {["Cash on Delivery", "Bkash", "Rocket"].map((method) => (
                      <label
                        key={method}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-2 text-sm font-bold transition ${
                          orderInfo.paymentMethod === method
                            ? "border-[var(--theme-primary)] bg-[var(--theme-muted-bg)] text-slate-950"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[var(--theme-primary)]"
                        }`}
                      >
                        <span>{method}</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={orderInfo.paymentMethod === method}
                          onChange={handleOrderChange}
                          className="h-4 w-4 accent-[var(--theme-primary)]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase text-slate-500">
                    <Truck size={15} />
                    Shipping
                  </div>
                  <div className="grid gap-2">
                    {[70, 120].map((val) => (
                      <label
                        key={val}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-2 text-sm font-bold transition ${
                          Number(orderInfo.shippingCharge) === val
                            ? "border-[var(--theme-primary)] bg-[var(--theme-muted-bg)] text-slate-950"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[var(--theme-primary)]"
                        }`}
                      >
                        <span>{val === 70 ? "Inside Dhaka" : "Outside Dhaka"}</span>
                        <span className="flex items-center gap-2">
                          BDT {val}
                          <input
                            type="radio"
                            name="shippingCharge"
                            value={val}
                            checked={Number(orderInfo.shippingCharge) === val}
                            onChange={handleOrderChange}
                            className="h-4 w-4 accent-[var(--theme-primary)]"
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-100 bg-white px-4 py-4 sm:px-6">
              <button
                type="submit"
                className="theme-gradient theme-gradient-hover flex w-full items-center justify-center gap-3 rounded-2xl border-0 px-5 py-3.5 text-sm font-black text-white shadow-[0_16px_36px_rgba(11,125,35,0.22)] transition active:scale-[0.99]"
              >
                <span>Confirm Order</span>
                <span className="rounded-full bg-white/20 px-3 py-1">BDT {grandTotal}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderDrawer;

