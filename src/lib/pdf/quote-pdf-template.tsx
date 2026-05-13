/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Tipografías base — @react-pdf usa Helvetica por defecto, que se ve profesional.
// Si más adelante queremos Fraunces, hay que registrar la fuente con Font.register.

// ---------- Tipos ----------

export interface QuotePdfLine {
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface QuotePdfData {
  number: number;
  issued_at: string; // ISO
  valid_until: string | null;
  currency: string;
  subtotal: number;
  discount: number;
  tax_rate: number;
  tax: number;
  total: number;
  notes_public: string | null;
  lines: QuotePdfLine[];
  client: {
    full_name: string;
    email: string | null;
    phone: string | null;
    identification: string | null;
    address: string | null;
    city: string | null;
  } | null;
  event: {
    title: string;
    event_date: string | null;
    guests: number | null;
    space_name: string | null;
    type_name: string | null;
  } | null;
  venue: {
    name: string;
    tagline: string;
    address: string;
    city: string;
    email: string;
    whatsapp_display: string;
    website: string;
  };
  logo_url: string | null;
}

// ---------- Estilos ----------

const colors = {
  primary: "#2E4A3A",
  primaryDark: "#1F2F1D",
  primaryLight: "#5A8050",
  cream: "#FBF9F4",
  creamDark: "#F5EFE2",
  text: "#1F2F1D",
  muted: "#6B7C66",
  border: "#D5DDD0",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: `1pt solid ${colors.border}`,
  },
  logo: {
    width: 140,
    objectFit: "contain",
  },
  brandText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: colors.primary,
  },
  brandTagline: {
    fontSize: 8,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  quoteLabel: {
    fontSize: 8,
    color: colors.muted,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  quoteNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: colors.primary,
    marginTop: 2,
  },
  headerMeta: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 6,
  },

  // Boxes de datos
  blockRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  block: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: 12,
    borderRadius: 6,
  },
  blockTitle: {
    fontSize: 8,
    color: colors.muted,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  blockBody: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.4,
  },
  blockBodyStrong: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 2,
  },

  // Tabla
  table: {
    marginTop: 8,
    marginBottom: 20,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    color: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeadCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: `0.5pt solid ${colors.border}`,
  },
  tableRowAlt: {
    backgroundColor: colors.cream,
  },
  cellDesc: { flex: 4 },
  cellQty: { flex: 1, textAlign: "right" },
  cellPrice: { flex: 1.5, textAlign: "right" },
  cellSubtotal: { flex: 1.5, textAlign: "right" },

  // Totales
  totalsWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  totalsBox: {
    width: 240,
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.text,
  },
  totalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  grandTotalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grandTotalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  // Notas
  notes: {
    marginTop: 24,
    padding: 14,
    backgroundColor: colors.creamDark,
    borderRadius: 6,
  },
  notesTitle: {
    fontSize: 8,
    color: colors.muted,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  notesBody: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTop: `1pt solid ${colors.border}`,
    fontSize: 8,
    color: colors.muted,
  },
  footerCol: {
    maxWidth: "33%",
  },
});

// ---------- Helpers ----------

function formatMoney(v: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  }).format(v);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ---------- Componente principal ----------

export function QuotePdf(data: QuotePdfData) {
  const c = data.currency;

  return (
    <Document
      title={`Cotización ${data.number}`}
      author={data.venue.name}
      creator={data.venue.name}
    >
      <Page size="LETTER" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            {data.logo_url ? (
              <Image src={data.logo_url} style={styles.logo} />
            ) : (
              <>
                <Text style={styles.brandText}>{data.venue.name}</Text>
                <Text style={styles.brandTagline}>{data.venue.tagline}</Text>
              </>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quoteLabel}>Cotización</Text>
            <Text style={styles.quoteNumber}>#{data.number}</Text>
            <Text style={styles.headerMeta}>
              Emisión: {formatDate(data.issued_at)}
            </Text>
            {data.valid_until && (
              <Text style={styles.headerMeta}>
                Válida hasta: {formatDate(data.valid_until)}
              </Text>
            )}
          </View>
        </View>

        {/* DATOS: cliente + evento */}
        <View style={styles.blockRow}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Cliente</Text>
            {data.client ? (
              <>
                <Text style={styles.blockBodyStrong}>
                  {data.client.full_name}
                </Text>
                {data.client.identification && (
                  <Text style={styles.blockBody}>
                    ID: {data.client.identification}
                  </Text>
                )}
                {data.client.email && (
                  <Text style={styles.blockBody}>{data.client.email}</Text>
                )}
                {data.client.phone && (
                  <Text style={styles.blockBody}>{data.client.phone}</Text>
                )}
                {(data.client.address || data.client.city) && (
                  <Text style={styles.blockBody}>
                    {[data.client.address, data.client.city]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.blockBody}>—</Text>
            )}
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Evento</Text>
            {data.event ? (
              <>
                <Text style={styles.blockBodyStrong}>{data.event.title}</Text>
                {data.event.type_name && (
                  <Text style={styles.blockBody}>
                    Tipo: {data.event.type_name}
                  </Text>
                )}
                {data.event.event_date && (
                  <Text style={styles.blockBody}>
                    Fecha: {formatDate(data.event.event_date)}
                  </Text>
                )}
                {data.event.space_name && (
                  <Text style={styles.blockBody}>
                    Espacio: {data.event.space_name}
                  </Text>
                )}
                {data.event.guests != null && (
                  <Text style={styles.blockBody}>
                    Invitados: {data.event.guests}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.blockBody}>—</Text>
            )}
          </View>
        </View>

        {/* TABLA DE LÍNEAS */}
        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadCell, styles.cellDesc]}>
              Descripción
            </Text>
            <Text style={[styles.tableHeadCell, styles.cellQty]}>Cant.</Text>
            <Text style={[styles.tableHeadCell, styles.cellPrice]}>
              Precio
            </Text>
            <Text style={[styles.tableHeadCell, styles.cellSubtotal]}>
              Subtotal
            </Text>
          </View>
          {data.lines.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.blockBody}>
                Sin líneas en esta cotización.
              </Text>
            </View>
          ) : (
            data.lines.map((line, i) => (
              <View
                key={i}
                style={[
                  styles.tableRow,
                  i % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={styles.cellDesc}>{line.description}</Text>
                <Text style={styles.cellQty}>{line.quantity}</Text>
                <Text style={styles.cellPrice}>
                  {formatMoney(line.unit_price, c)}
                </Text>
                <Text style={styles.cellSubtotal}>
                  {formatMoney(line.subtotal, c)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* TOTALES */}
        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatMoney(data.subtotal, c)}
              </Text>
            </View>
            {data.discount > 0 && (
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Descuento</Text>
                <Text style={styles.totalValue}>
                  − {formatMoney(data.discount, c)}
                </Text>
              </View>
            )}
            {data.tax > 0 && (
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>IVA ({data.tax_rate}%)</Text>
                <Text style={styles.totalValue}>
                  {formatMoney(data.tax, c)}
                </Text>
              </View>
            )}
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatMoney(data.total, c)}
              </Text>
            </View>
          </View>
        </View>

        {/* NOTAS */}
        {data.notes_public && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notas</Text>
            <Text style={styles.notesBody}>{data.notes_public}</Text>
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <View style={styles.footerCol}>
            <Text>{data.venue.name}</Text>
            <Text>{data.venue.tagline}</Text>
          </View>
          <View style={styles.footerCol}>
            <Text>{data.venue.address}</Text>
            <Text>{data.venue.city}</Text>
          </View>
          <View style={styles.footerCol}>
            <Text>{data.venue.email}</Text>
            <Text>WhatsApp: {data.venue.whatsapp_display}</Text>
            <Text>{data.venue.website}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
