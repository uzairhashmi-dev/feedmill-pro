export const EMPTY_FORM = {
  feedName:  "",
  formulaId: "",
  quantity:  "",   
  unit:      "kg", 
  waste:     "0",  
  status:    "Running",
};

export const STATUS_CFG = {
  Running:   { bg: "bg-blue-50",    text: "text-blue-700",    dot: "#2196F3" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "#2D6A4F" },
  Queued:    { bg: "bg-amber-50",   text: "text-amber-700",   dot: "#F4A261" },
  Cancelled: { bg: "bg-red-50",     text: "text-red-700",     dot: "#E63946" },
};

export const PIE_COLORS = ["#2196F3", "#2D6A4F", "#F4A261", "#E63946"];

export const UNIT_OPTIONS = [
  { value: "kg",    label: "kg"    },
  { value: "ton",   label: "Ton"   },
  { value: "liter", label: "Liter" },
];