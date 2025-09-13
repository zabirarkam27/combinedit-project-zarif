import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// ===== Helper function =====
const wrapTextByWords = (text, limit = 6) => {
  if (!text) return "";
  const words = text.split(" ");
  let result = "";
  for (let i = 0; i < words.length; i++) {
    result += words[i] + " ";
    if ((i + 1) % limit === 0) {
      result += "\n";
    }
  }
  return result.trim();
};

// ===== Styles =====
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#06b5d4",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logo: { width: 100, height: 50, objectFit: "contain" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  section: { marginTop: 15, marginLeft: 8 },
  orderSection: { flex: 1, alignItems: "flex-end" },
  bold: { fontWeight: "bold" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingRight: 8,
    paddingLeft: 8,
  },
  table: {
    display: "table",
    width: "99%",
    marginTop: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginRight: 20,
    marginLeft: 8,
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
  colProduct: { flexBasis: "40%" },
  colQty: { flexBasis: "20%", textAlign: "center" },
  colUnit: { flexBasis: "20%", textAlign: "center" },
  colTotal: { flexBasis: "20%", textAlign: "center" },
  totals: { marginTop: 20, rowGap: 8, textAlign: "right" },
});

// ===== Invoice Document =====
const InvoiceDocument = ({ order }) => {
  const totalProductPrice = order.items?.reduce(
    (sum, item) => sum + (item.finalPrice || 0),
    0
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="https://i.ibb.co.com/k25ggjgL/logo.png"
            style={styles.logo}
          />
          <Text style={styles.headerText}>Invoice</Text>
        </View>

        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.bold}>Bill To:</Text>
            <Text>{wrapTextByWords(order.name, 6)}</Text>
            <Text>{wrapTextByWords(order.address, 6)}</Text>
            <Text>{order.phone}</Text>
          </View>
          <View style={styles.orderSection}>
            <Text style={{ textAlign: "right" }}>
              <Text style={styles.bold}>Order#:</Text> {order.orderNumber}
            </Text>
            <Text style={{ textAlign: "right" }}>
              <Text style={styles.bold}>Order Date:</Text>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "-"}
            </Text>
            <Text style={{ textAlign: "right" }}>
              <Text style={styles.bold}>Payment Method:</Text>{" "}
              {order.paymentMethod}
            </Text>
            <Text style={{ textAlign: "right" }}>
              <Text style={styles.bold}>Payment Status:</Text>{" "}
              {order.paymentStatus}
            </Text>
            <Text style={{ textAlign: "right" }}>
              <Text style={styles.bold}>Status:</Text> {order.status}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Bill From:</Text>
          <Text>Combined IT</Text>
          <Text>
            House: 26 Naya Paltan, Masjid Market, VIP Road, Dhaka-1000
          </Text>
          <Text>info@combinedit.com</Text>
          <Text>09678-321321</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.colProduct, styles.bold]}>
              Product
            </Text>
            <Text style={[styles.tableCol, styles.colQty, styles.bold]}>
              Qty
            </Text>
            <Text style={[styles.tableCol, styles.colUnit, styles.bold]}>
              Unit Price
            </Text>
            <Text style={[styles.tableCol, styles.colTotal, styles.bold]}>
              Total
            </Text>
          </View>
          {order.items?.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={[styles.tableCol, styles.colProduct]}>
                {item.productName}
              </Text>
              <Text style={[styles.tableCol, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCol, styles.colUnit]}>
                {item.unitPrice}
              </Text>
              <Text style={[styles.tableCol, styles.colTotal]}>
                {item.finalPrice}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <Text>
            <Text style={styles.bold}>Product Price:</Text>{" "}
            {totalProductPrice || 0}
          </Text>
          <Text>
            <Text style={styles.bold}>Shipping:</Text>{" "}
            {order.shippingCharge || 0}
          </Text>
          <Text>
            <Text style={styles.bold}>Grand Total:</Text> {order.grandTotal}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// ===== Invoice Page =====
const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order details");
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(`/dashboard/view-order/${order._id}`)}
          className="btn btn-warning"
        >
          Back To Order
        </button>

        {/* Mobile Download */}
        <div className="md:hidden">
          <PDFDownloadLink
            document={<InvoiceDocument order={order} />}
            fileName={`invoice_${order.orderNumber}.pdf`}
          >
            {({ loading }) => (
              <button className="btn btn-success">
                {loading ? "Generating..." : "Download Invoice"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Desktop PDF Preview */}
      <div className="hidden md:block max-w-5xl h-[800px] mx-auto bg-gray-200 shadow-lg rounded-lg p-4 mt-6">
        <PDFViewer width="100%" height="100%" showToolbar={true}>
          <InvoiceDocument order={order} />
        </PDFViewer>
      </div>
    </>
  );
};

export default InvoicePage;
