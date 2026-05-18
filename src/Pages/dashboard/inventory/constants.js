export const STATUS_COLORS = {
  Received: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "#2D6A4F" },
  Pending:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "#F4A261" },
  Placed:   { bg: "bg-blue-50",    text: "text-blue-700",    dot: "#2196F3" },
};

export const PIE_COLORS = ["#2D6A4F", "#F4A261", "#2196F3"];

export const UNIT_OPTIONS = [
  { value: "kg",    label: "kg",    hint: "Kilograms — backend receives numeric kg value" },
  { value: "ton",   label: "Ton",   hint: "Metric tons — backend receives numeric ton value" },
  { value: "liter", label: "Liter", hint: "Litres — backend receives numeric liter value" },
];

export const EMPTY_FORM = {
  itemName:          "",
  vendorName:        "",
  price:             "",
  quantityReceived:  "",  // ← was "quantity", now "quantityReceived"
  unit:              "kg",
  status:            "Pending",
};