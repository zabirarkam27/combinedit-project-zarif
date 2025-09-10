import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Helper function for word wrapping
const wrapTextByWords = (text, limit = 6) => {
  if (!text) return "";
  const words = text.split(" ");
  let result = "";
  for (let i = 0; i < words.length; i++) {
    result += words[i] + " ";
    if ((i + 1) % limit === 0) {
      result += "\n"; // Add line break after 6 words
    }
  }
  return result.trim();
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 20,
    backgroundColor: "#ffffff",
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
  logo: {
    width: 80,
    height: 50,
    objectFit: "contain",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginTop: 15,
    marginLeft: 8,
  },
  orderSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  bold: {
    fontWeight: "bold",
  },
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
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
  colProduct: {
    flexBasis: "40%",
  },
  colQty: {
    flexBasis: "20%",
    textAlign: "center",
  },
  colUnit: {
    flexBasis: "20%",
    textAlign: "center",
  },
  colTotal: {
    flexBasis: "20%",
    textAlign: "center",
  },
  totals: {
    marginTop: 20,
    rowGap: 8,
    textAlign: "right",
  },
});

const InvoiceDocument = ({ order, orders }) => {
  const list = orders || (order ? [order] : []);

  return (
    <Document>
      {list.map((o, idx) => {
        const totalProductPrice = o.items?.reduce(
          (sum, item) => sum + (item.finalPrice || 0),
          0
        );

        return (
          <Page key={idx} size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                src="https://i.ibb.co.com/k25ggjgL/logo.png"
                style={styles.logo}
              />
              <Text style={styles.headerText}>Invoice</Text>
            </View>

            {/* Bill To & Order Info */}
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.bold}>Bill To:</Text>
                <Text>{wrapTextByWords(o.name, 6)}</Text>
                <Text>{wrapTextByWords(o.address, 6)}</Text>
                <Text>{o.phone}</Text>
              </View>

              <View style={styles.orderSection}>
                <Text style={{ textAlign: "right" }}>
                  <Text style={styles.bold}>Order#:</Text> {o.orderNumber}
                </Text>
                <Text style={{ textAlign: "right" }}>
                  <Text style={styles.bold}>Order Date:</Text>{" "}
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString()
                    : "-"}
                </Text>
                <Text style={{ textAlign: "right" }}>
                  <Text style={styles.bold}>Payment Method:</Text>{" "}
                  {o.paymentMethod}
                </Text>
                <Text style={{ textAlign: "right" }}>
                  <Text style={styles.bold}>Payment Status:</Text>{" "}
                  {o.paymentStatus}
                </Text>
                <Text style={{ textAlign: "right" }}>
                  <Text style={styles.bold}>Status:</Text> {o.status}
                </Text>
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
              {o.items && o.items.length > 0 ? (
                o.items.map((item, idx) => (
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
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.colProduct]}>
                    No items
                  </Text>
                  <Text style={[styles.tableCol, styles.colQty]}>-</Text>
                  <Text style={[styles.tableCol, styles.colUnit]}>-</Text>
                  <Text style={[styles.tableCol, styles.colTotal]}>-</Text>
                </View>
              )}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
              <Text>
                <Text style={styles.bold}>Product Price:</Text>{" "}
                {totalProductPrice || 0}
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
