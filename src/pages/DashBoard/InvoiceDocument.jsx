import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Helper function for word wrapping
const wrapTextByWords = (text, limit = 6) =>
  text
    ? text
        .split(" ")
        .reduce(
          (acc, word, idx) =>
            acc + word + ((idx + 1) % limit === 0 ? "\n" : " "),
          ""
        )
        .trim()
    : "";

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
  logo: { width: 80, height: 50, objectFit: "contain" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 8,
  },
  orderSection: { alignItems: "flex-end" },
  bold: { fontWeight: "bold" },
  section: { marginTop: 15, marginLeft: 8 },
  table: {
    display: "table",
    width: "100%",
    marginTop: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
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

const InvoiceDocument = ({ order, orders }) => {
  const list = orders ?? (order ? [order] : []);

  return (
    <Document>
      {list.map((o, idx) => {
        // Precompute total product price only once
        const totalProductPrice =
          o.items?.reduce((sum, item) => sum + (item.finalPrice || 0), 0) ?? 0;

        return (
          <Page key={idx} size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                src="https://i.ibb.co/k25ggjgL/logo.png"
                style={styles.logo}
              />
              <Text style={styles.headerText}>Invoice</Text>
            </View>

            {/* Bill To & Order Info */}
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.bold}>Bill To:</Text>
                {["name", "address"].map((field) => (
                  <Text key={field}>{wrapTextByWords(o[field], 6)}</Text>
                ))}
                <Text>{o.phone}</Text>
              </View>

              <View style={styles.orderSection}>
                {[
                  "orderNumber",
                  "createdAt",
                  "paymentMethod",
                  "paymentStatus",
                  "status",
                ].map((field) => (
                  <Text key={field} style={{ textAlign: "right" }}>
                    <Text style={styles.bold}>
                      {field === "createdAt"
                        ? "Order Date:"
                        : field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase()) + ":"}
                    </Text>{" "}
                    {field === "createdAt"
                      ? o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : "-"
                      : o[field]}
                  </Text>
                ))}
              </View>
            </View>

            {/* Bill From */}
            <View style={styles.section}>
              <Text style={styles.bold}>Bill From:</Text>
              <Text>Combined IT</Text>
              <Text>
                House: 26 Naya Paltan, Masjid Market, VIP Road, Dhaka-1000
              </Text>
              <Text>info@combinedit.com</Text>
              <Text>09678-321321</Text>
            </View>

            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {[
                  { label: "Product", style: styles.colProduct },
                  { label: "Qty", style: styles.colQty },
                  { label: "Unit Price", style: styles.colUnit },
                  { label: "Total", style: styles.colTotal },
                ].map((col) => (
                  <Text
                    key={col.label}
                    style={[styles.tableCol, col.style, styles.bold]}
                  >
                    {col.label}
                  </Text>
                ))}
              </View>

              {(o.items && o.items.length > 0
                ? o.items
                : [
                    {
                      productName: "No items",
                      quantity: "-",
                      unitPrice: "-",
                      finalPrice: "-",
                    },
                  ]
              ).map((item, idx) => (
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

            {/* Totals */}
            <View style={styles.totals}>
              <Text>
                <Text style={styles.bold}>Product Price:</Text>{" "}
                {totalProductPrice}
              </Text>
              <Text>
                <Text style={styles.bold}>Shipping:</Text>{" "}
                {o.shippingCharge || 0}
              </Text>
              <Text>
                <Text style={styles.bold}>Grand Total:</Text> {o.grandTotal}
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default InvoiceDocument;
