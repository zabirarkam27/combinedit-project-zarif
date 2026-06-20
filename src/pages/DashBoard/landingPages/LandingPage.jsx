import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "../../../components/NavBar";
import { useOrdersContext } from "../../../context/OrdersContext";

// services
import { getLandingPageById } from "../../../services/landingPages";
import { getProductById } from "../../../services/products";
import { createOrder } from "../../../services/orders";
import { showOrderSuccessPopup } from "../../../utils/popups";
import { saveCustomerOrder } from "../../../utils/customerOrderHistory";

const landingInputClass =
  "input w-full bg-white border landing-border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--landing-button-primary)] focus:ring-opacity-50";

const landingButtonClass =
  "block text-center text-sm md:text-md landing-gradient landing-gradient-hover border-0 text-white font-semibold px-4 py-2 landing-radius hover:opacity-95 transition cursor-pointer";

const LandingPage = () => {
  const { fetchOrders } = useOrdersContext();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [page, setPage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [orderInfo, setOrderInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    shippingCharge: 70,
    paymentMethod: "Cash on Delivery",
  });

  // productTotal memoized
  const productTotal = useMemo(
    () => (product ? product.price * quantity : 0),
    [product, quantity]
  );

  const increaseQuantity = useCallback(
    () => setQuantity((prev) => prev + 1),
    []
  );
  const decreaseQuantity = useCallback(
    () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)),
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        // Landing page data আনো
        const { data } = await getLandingPageById(id, {
          signal: controller.signal,
        });
        const landingPage = data?.data || data;
        setPage(landingPage);

        // Product ফেচ parallel এ
        if (landingPage?.productId) {
          const [{ data: productData }] = await Promise.all([
            getProductById(landingPage.productId, {
              signal: controller.signal,
            }),
          ]);
          setProduct(productData);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          toast.error(
            err?.response?.data?.message || "❌ Failed to fetch landing page"
          );
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [id]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOrderChange = useCallback((e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    const orderData = {
      name: orderInfo.name,
      phone: orderInfo.phone,
      address: orderInfo.address,
      note: orderInfo.note,
      items: [
        {
          productId: product._id,
          productName: product.name,
          unitPrice: product.price,
          quantity,
          finalPrice: productTotal,
          images: product.images || [],
          status: "pending",
        },
      ],
      grandTotal: productTotal + Number(orderInfo.shippingCharge),
      orderNumber: `ORD-${String(Date.now()).slice(-9)}`,
      status: "pending",
      paymentMethod: orderInfo.paymentMethod,
      paymentStatus: "pending",
      shippingCharge: Number(orderInfo.shippingCharge),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await createOrder(orderData);
      const placedOrder = { ...orderData, ...(response?.data || {}) };
      saveCustomerOrder(placedOrder);
      const result = await showOrderSuccessPopup(
        "Order placed successfully",
        "Thank you. We received your order."
      );
      if (result.isConfirmed) {
        const { downloadInvoice } = await import("../../../utils/invoiceDownload.jsx");
        await downloadInvoice(placedOrder);
      }
      fetchOrders();
      setOrderInfo({
        name: "",
        phone: "",
        address: "",
        note: "",
        shippingCharge: 70,
        paymentMethod: "Cash on Delivery",
      });
      setQuantity(1);
    } catch (err) {
      toast.error("❌ Failed to place order");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg landing-page-bg landing-text">
        ⏳ ডাটা লোড হচ্ছে...
      </div>
    );
  }

  if (!page) {
    return <div className="p-10 landing-page-bg landing-text">❌ Page not found</div>;
  }

  return (
    <div className="landing-page-bg min-h-screen h-full md:px-5">
      <NavBar />
      <div className="md:mt-15 w-full landing-max-width mx-auto landing-content-bg p-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center py-4 landing-text">
          {page.nameEn} || {page.nameBn}
        </h1>

        {product && (
          <>
            <img
              src={product?.images?.[0]}
              alt={product?.name || "product"}
              className="rounded-md max-w-96 w-full h-auto object-contain mx-auto"
            />
            <button
              className={`px-4 py-2 my-5 mx-auto w-full sm:w-fit max-w-2xl ${landingButtonClass}`}
            >
              অর্ডার করতে চাই
            </button>
            <p className="text-base text-white text-center landing-notice-bg py-2 md:mt-12 mb-5 landing-radius">
              প্রয়োজনে কল করুন - 01534972602
            </p>
          </>
        )}

        {/* Order Form + Summary */}
        <div className="border landing-border landing-radius landing-section-bg">
          <h3 className="text-center font-semibold py-4 md:text-xl landing-text">
            অর্ডার করতে নিচের তথ্যগুলো দিন
          </h3>
          <div className="flex gap-1 justify-between flex-col md:flex-row mx-auto md:px-4">
            {/* Order Form */}
            <div className="md:border landing-border landing-radius mb-5 p-5">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-lg mx-auto"
              >
                <div className="grid gap-3 md:grid-cols-8 md:items-start">
                  <div className="space-y-2 text-xs font-bold landing-text md:col-span-2 md:space-y-8 md:pt-3">
                    <p>নাম</p>
                    <p>মোবাইল নাম্বার</p>
                    <p>ঠিকানা</p>
                    <p>অর্ডার নোট</p>
                  </div>
                  <div className="space-y-2 md:col-span-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="আপনার নাম"
                      value={orderInfo.name}
                      onChange={handleInputChange}
                      required
                      className={landingInputClass}
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="১১ ডিজিট মোবাইল নাম্বার"
                      value={orderInfo.phone}
                      onChange={handleInputChange}
                      required
                      className={landingInputClass}
                    />
                    <textarea
                      name="address"
                      placeholder="আপনার বাসার সম্পূর্ণ ঠিকানা"
                      value={orderInfo.address}
                      onChange={handleInputChange}
                      required
                      className={landingInputClass}
                    />
                    <textarea
                      name="note"
                      placeholder="স্পেশাল কিছু বলতে চাইলে লিখুন (অপশনাল)"
                      value={orderInfo.note}
                      onChange={handleInputChange}
                      className={landingInputClass}
                      rows="3"
                    />
                  </div>
                </div>

                {/* Shipping Charge */}
                <div className="shipping-charge mt-10 landing-text">
                  <label className="font-semibold">ডেলিভারি এলাকা</label>
                  <div className="space-y-2 mt-4">
                    {[70, 120].map((val) => (
                      <label
                        key={val}
                        className="flex items-center gap-2 border landing-border landing-radius p-2 text-sm landing-card-bg"
                      >
                        <input
                          type="radio"
                          name="shippingCharge"
                          value={val}
                          checked={Number(orderInfo.shippingCharge) === val}
                          onChange={handleOrderChange}
                          className="radio checked:bg-[var(--landing-button-primary)] checked:border-[var(--landing-button-primary)]"
                        />
                        {val === 70 ? (
                          <div className="flex flex-row justify-between w-full ">
                            <p>ঢাকার ভেতরে</p>
                            <p>৳70</p>
                          </div>
                        ) : (
                          <div className="flex flex-row justify-between w-full">
                            <p>ঢাকার বাহিরে</p>
                            <p>৳120</p>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`${landingButtonClass} w-full hidden md:block`}
                >
                  Confirm Order
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 px-2 md:px-0 mb-4">
              <div className="border landing-border landing-radius px-4 py-2 landing-card-bg">
                {product && (
                  <div className="flex items-center gap-3 justify-center">
                    <img
                      src={product?.images?.[0]}
                      alt={product?.name || "product"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="landing-text">
                      <h3 className="font-semibold">{product?.name}</h3>
                      <p className="text-sm landing-muted-text">
                        Product Total: BDT {productTotal}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <button
                          onClick={decreaseQuantity}
                          className="px-2 py-1 bg-[var(--landing-button-primary)] text-white landing-radius"
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={increaseQuantity}
                          className="px-2 py-1 bg-[var(--landing-button-primary)] text-white landing-radius"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border landing-border landing-radius space-y-3 px-5 py-4 landing-card-bg">
                <div className="text-sm">
                  <div className="flex justify-between landing-text">
                    <p>মোট </p>
                    <p>৳ {productTotal}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between landing-text">
                    <p>ডেলিভারি চার্জ</p>
                    <p>৳ {Number(orderInfo.shippingCharge)}</p>
                  </div>
                </div>
                <div className="border-t-1 landing-border"></div>
                <div>
                  <div className="flex justify-between text-sm landing-text">
                    <p className="font-semibold">সর্বমোট </p>
                    <p className="font-semibold">
                      ৳ {productTotal + Number(orderInfo.shippingCharge)}
                    </p>
                  </div>
                </div>
              </div>
              {/* Payment Method */}
              <div className="payment-method px-2 landing-text">
                <label className="font-semibold">পেমেন্ট মেথড</label>
                <div className="flex flex-col gap-4 mt-4 text-sm">
                  {["Cash on Delivery", "Bkash", "Rocket"].map((method) => (
                    <label key={method} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={orderInfo.paymentMethod === method}
                        onChange={handleOrderChange}
                        className="radio checked:bg-[var(--landing-button-primary)] checked:border-[var(--landing-button-primary)]"
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className={`${landingButtonClass} w-full md:hidden block`}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>

        {/* Product details */}
        {product && (
          <div className="collapse collapse-arrow rounded-lg mt-4 mb-25 md:mb-6">
            <input type="checkbox" />
            <div className="collapse-title text-base md:text-lg font-medium landing-section-bg landing-text">
              পন্যের বিবরণ দেখতে ক্লিক করুন
            </div>
            <div className="collapse-content mt-10 text-base md:text-lg landing-text">
              <p className="text-base md:text-lg">পণ্যের বিবরণ</p>
              <h2 className="text-2xl font-semibold my-2">{product?.name}</h2>
              <p className="text-base mb-1">
                <span className="font-semibold">Category:</span>{" "}
                {product?.category}
              </p>
              <p className="text-base mb-1">
                <span className="font-semibold">Brand:</span> {product?.brand}
              </p>
              <p className="text-base mb-1">
                <span className="font-semibold">Weight:</span>{" "}
                {product?.weight || product?.volume}
              </p>
              <p className="text-base mb-1">
                <span className="font-semibold">Price:</span> BDT{" "}
                {product?.price}
              </p>
              <p className="text-base mb-3">
                <span className="font-semibold">In Stock:</span>{" "}
                {product?.inStock ? "Yes" : "No"}
              </p>
              <p className="landing-muted-text text-base font-normal mb-4">
                {product?.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
