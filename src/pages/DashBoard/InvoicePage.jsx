import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

import api from "../../api";
import useProfileData from "../../hooks/useProfileData";
import InvoiceDocument from "./InvoiceDocument";

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfileData();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const memoizedDocument = useMemo(
    () => order && <InvoiceDocument order={order} themeColors={profile?.themeColors || {}} />,
    [order, profile?.themeColors]
  );

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (!order) return <p className="mt-10 text-center">Order not found</p>;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 sm:p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.07)] sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate(`/dashboard/view-order/${order._id}`)}
          className="btn btn-warning w-full sm:w-auto"
        >
          Back To Order
        </button>

        <div className="md:hidden">
          <PDFDownloadLink
            document={memoizedDocument}
            fileName={`invoice_${order.orderNumber}.pdf`}
          >
            {({ loading }) => (
              <button className="btn btn-success w-full">
                {loading ? "Generating..." : "Download Invoice"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="mx-auto mt-6 hidden h-[800px] max-w-5xl rounded-2xl bg-gray-200 p-4 shadow-lg md:block">
        <PDFViewer width="100%" height="100%" showToolbar={true}>
          {memoizedDocument}
        </PDFViewer>
      </div>
    </div>
  );
};

export default InvoicePage;
