export const EMPTY_FORM = {
  customerName: "",
  formulaId:    "",
  quantity:     "",
  unit:         "kg",
  price:        "",
  paymentPaid:  "0",
  status:       "Pending",
};

export const STATUS_CFG = {
  Pending: {
    bg:   "bg-amber-50",
    text: "text-amber-700",
    dot:  "#F4A261",
  },
  Completed: {
    bg:   "bg-emerald-50",
    text: "text-emerald-700",
    dot:  "#2D6A4F",
  },
  Cancelled: {
    bg:   "bg-red-50",
    text: "text-red-700",
    dot:  "#E63946",
  },
};

export const PIE_COLORS = ["#F4A261", "#2D6A4F", "#E63946"];

export const UNIT_OPTIONS = [
  { value: "kg",    label: "kg"    },
  { value: "ton",   label: "Ton"   },
  { value: "liter", label: "Liter" },
];