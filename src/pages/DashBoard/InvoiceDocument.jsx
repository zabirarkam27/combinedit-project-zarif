import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { normalizeThemeColors } from "../../utils/theme";

Font.register({
  family: "NotoSansBengali",
  fonts: [
    { src: "/fonts/NotoSansBengali-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/NotoSansBengali-Bold.ttf", fontWeight: 700 },
  ],
});

const safeText = (value, fallback = "-") => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "object") return value.status || value.paymentStatus || fallback;
  return String(value);
};

const wrapTextByWords = (text, limit = 7) =>
  safeText(text, "")
    .split(" ")
    .reduce(
      (acc, word, idx) => acc + word + ((idx + 1) % limit === 0 ? "\n" : " "),
      ""
    )
    .trim();

const formatCurrency = (value) => `BDT ${Number(value || 0).toLocaleString("en-US")}`;

const getInitials = (name = "Combined IT") =>
  safeText(name, "Combined IT")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") || "CI";

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "-";
};

const createStyles = (themeColors = {}) => {
  const theme = normalizeThemeColors(themeColors);
  const primary = theme.primary;
  const secondary = theme.secondary;
  const text = theme.text;
  const softBg = theme.pageBg;
  const border = "#dce8d8";

  return StyleSheet.create({
    page: {
      fontFamily: "NotoSansBengali",
      fontSize: 10.5,
      padding: 24,
      backgroundColor: "#ffffff",
      color: text,
    },
    header: {
      backgroundColor: primary,
      borderRadius: 16,
      minHeight: 92,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 14,
    },
    logoWrap: {
      width: 122,
      minHeight: 54,
      borderRadius: 10,
      backgroundColor: primary,
      padding: 4,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    logo: { width: 112, height: 46, objectFit: "contain" },
    logoFallback: {
      width: 86,
      height: 42,
      borderRadius: 10,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: border,
    },
    logoFallbackText: {
      color: primary,
      fontSize: 22,
      fontWeight: 700,
    },
    headerMeta: { alignItems: "flex-end" },
    headerEyebrow: { fontSize: 9, color: "#dff8e7", fontWeight: 700, textTransform: "uppercase" },
    headerText: { marginTop: 4, fontSize: 24, fontWeight: 700, color: "#ffffff" },
    headerSubtext: { marginTop: 4, fontSize: 9, color: "#eafcf0" },
    cardRow: {
      flexDirection: "row",
      gap: 14,
      marginTop: 18,
    },
    card: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: border,
      backgroundColor: "#fbfdfb",
      padding: 12,
    },
    cardRight: { alignItems: "flex-end" },
    sectionLabel: {
      fontSize: 9,
      fontWeight: 700,
      color: primary,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    bold: { fontWeight: 700, color: text },
    muted: { color: "#5f6f62" },
    line: { marginTop: 3, lineHeight: 1.45 },
    fromSection: {
      marginTop: 14,
      borderRadius: 14,
      backgroundColor: softBg,
      padding: 12,
      borderWidth: 1,
      borderColor: border,
    },
    table: {
      width: "100%",
      marginTop: 18,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: border,
      overflow: "hidden",
    },
    tableRow: { flexDirection: "row" },
    tableHead: { backgroundColor: primary },
    tableCol: {
      borderRightWidth: 1,
      borderRightColor: border,
      paddingHorizontal: 8,
      paddingVertical: 8,
      fontSize: 9.5,
      minHeight: 32,
    },
    headText: { color: "#ffffff", fontWeight: 700 },
    colProduct: { flexBasis: "43%" },
    colQty: { flexBasis: "15%", textAlign: "center" },
    colUnit: { flexBasis: "21%", textAlign: "right" },
    colTotal: { flexBasis: "21%", textAlign: "right", borderRightWidth: 0 },
    zebra: { backgroundColor: "#f8fbf7" },
    totalsWrap: {
      marginTop: 18,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    totals: {
      width: 220,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: border,
      overflow: "hidden",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    grandTotal: { backgroundColor: primary, borderBottomWidth: 0 },
    grandText: { color: "#ffffff", fontWeight: 700 },
    footer: {
      marginTop: 24,
      borderTopWidth: 1,
      borderTopColor: border,
      paddingTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      color: "#5f6f62",
      fontSize: 9,
    },
    accent: { color: secondary, fontWeight: 700 },
  });
};

const InvoiceDocument = ({ order, orders, themeColors, profile }) => {
  const list = orders ?? (order ? [order] : []);
  const styles = createStyles(themeColors);
  const businessName = safeText(profile?.name, "Combined IT");
  const businessAddress = safeText(
    profile?.address,
    "House: 26 Naya Paltan, Masjid Market, VIP Road, Dhaka-1000"
  );
  const businessEmail = safeText(profile?.email, "info@combinedit.com");
  const businessPhone = safeText(profile?.phone, "09678-321321");
  const logoSrc = profile?.logo;

  return (
    <Document>
      {list.map((o, idx) => {
        const totalProductPrice =
          o.items?.reduce((sum, item) => {
            const lineTotal = item.finalPrice ?? Number(item.unitPrice || 0) * Number(item.quantity || 1);
            return sum + Number(lineTotal || 0);
          }, 0) ?? 0;

        return (
          <Page key={idx} size="A4" style={styles.page}>
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                {logoSrc ? (
                  <Image src={logoSrc} style={styles.logo} />
                ) : (
                  <View style={styles.logoFallback}>
                    <Text style={styles.logoFallbackText}>{getInitials(businessName)}</Text>
                  </View>
                )}
              </View>
              <View style={styles.headerMeta}>
                <Text style={styles.headerEyebrow}>Official Invoice</Text>
                <Text style={styles.headerText}>Invoice</Text>
                <Text style={styles.headerSubtext}>{safeText(o.orderNumber, `Order ${idx + 1}`)}</Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.card}>
                <Text style={styles.sectionLabel}>Bill To</Text>
                <Text style={[styles.line, styles.bold]}>{safeText(o.name, "Customer")}</Text>
                <Text style={styles.line}>{wrapTextByWords(o.address, 7) || "-"}</Text>
                <Text style={styles.line}>{safeText(o.phone)}</Text>
              </View>

              <View style={[styles.card, styles.cardRight]}>
                <Text style={styles.sectionLabel}>Order Info</Text>
                <Text style={styles.line}><Text style={styles.bold}>Date: </Text>{formatDate(o.createdAt)}</Text>
                <Text style={styles.line}><Text style={styles.bold}>Payment: </Text>{safeText(o.paymentMethod)}</Text>
                <Text style={styles.line}><Text style={styles.bold}>Payment Status: </Text>{safeText(o.paymentStatus)}</Text>
                <Text style={styles.line}><Text style={styles.bold}>Order Status: </Text>{safeText(o.status)}</Text>
              </View>
            </View>

            <View style={styles.fromSection}>
              <Text style={styles.sectionLabel}>Bill From</Text>
              <Text style={[styles.line, styles.bold]}>{businessName}</Text>
              <Text style={styles.line}>{wrapTextByWords(businessAddress, 8)}</Text>
              <Text style={styles.line}>{businessEmail} | {businessPhone}</Text>
            </View>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHead]}>
                {[
                  { label: "Product", style: styles.colProduct },
                  { label: "Qty", style: styles.colQty },
                  { label: "Unit Price", style: styles.colUnit },
                  { label: "Total", style: styles.colTotal },
                ].map((col) => (
                  <Text key={col.label} style={[styles.tableCol, col.style, styles.headText]}>{col.label}</Text>
                ))}
              </View>

              {(o.items && o.items.length > 0
                ? o.items
                : [{ productName: "No items", quantity: "-", unitPrice: "-", finalPrice: "-" }]
              ).map((item, itemIndex) => {
                const lineTotal = item.finalPrice ?? Number(item.unitPrice || 0) * Number(item.quantity || 1);
                return (
                  <View style={[styles.tableRow, itemIndex % 2 === 1 ? styles.zebra : null]} key={itemIndex}>
                    <Text style={[styles.tableCol, styles.colProduct]}>{safeText(item.productName || item.name)}</Text>
                    <Text style={[styles.tableCol, styles.colQty]}>{safeText(item.quantity)}</Text>
                    <Text style={[styles.tableCol, styles.colUnit]}>{typeof item.unitPrice === "number" ? formatCurrency(item.unitPrice) : safeText(item.unitPrice)}</Text>
                    <Text style={[styles.tableCol, styles.colTotal]}>{typeof lineTotal === "number" ? formatCurrency(lineTotal) : safeText(lineTotal)}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.totalsWrap}>
              <View style={styles.totals}>
                <View style={styles.totalRow}>
                  <Text style={styles.muted}>Product Price</Text>
                  <Text style={styles.bold}>{formatCurrency(totalProductPrice)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.muted}>Shipping</Text>
                  <Text style={styles.bold}>{formatCurrency(o.shippingCharge || 0)}</Text>
                </View>
                <View style={[styles.totalRow, styles.grandTotal]}>
                  <Text style={styles.grandText}>Grand Total</Text>
                  <Text style={styles.grandText}>{formatCurrency(o.grandTotal ?? totalProductPrice)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text>Thank you for shopping with <Text style={styles.accent}>{businessName}</Text>.</Text>
              <Text>Generated invoice</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default InvoiceDocument;


