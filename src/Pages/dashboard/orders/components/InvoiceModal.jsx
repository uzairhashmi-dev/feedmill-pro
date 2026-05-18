import { useRef } from "react";
import { X, Printer } from "lucide-react";

const InvoiceModal = ({ order, onClose }) => {
  const printRef = useRef(null);

  // ✅ Invoice prints always white — correct for paper
  // Dark mode only applied to the preview UI shell around it
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=1000");
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>Invoice - ${order._id?.slice(-8).toUpperCase()}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          html,body{width:100%;margin:0;padding:0;background:white;}
          body{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;font-family:sans-serif;}
          #print-root{width:100%;box-sizing:border-box;}
          @page{size:A4;margin:8mm;}
          @media print{html,body{width:210mm;height:297mm;overflow:hidden!important;}
          #print-root{width:100%;height:auto;overflow:hidden;}
          table,div{page-break-inside:avoid;}}
        </style>
      </head><body><div id="print-root">${content}</div></body></html>
    `);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); setTimeout(() => printWindow.print(), 500); };
  };

  const paidPct     = order.totalPayment > 0
    ? Math.min(100, Math.round((order.paymentPaid / order.totalPayment) * 100)) : 0;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-PK", { year:"numeric", month:"long", day:"numeric" });
  const formulaName = order.formula?.formulaName || "—";
  const formulaCode = order.formula?.formulaCode || "";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
                    flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-900
                      border border-transparent dark:border-gray-800
                      w-full max-w-5xl rounded-2xl shadow-2xl
                      flex flex-col max-h-[95vh] overflow-hidden">

        {/* Modal header — dark mode aware */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                        px-4 sm:px-6 py-4
                        border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Invoice Preview</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800
                         text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Printer size={16} /> Print Invoice
            </button>
            <button onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800
                         text-gray-500 dark:text-gray-400 hover:text-gray-700
                         dark:hover:text-gray-200 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable body — gray bg in dark, matches light mode feel */}
        <div className="overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950 p-3 sm:p-6">

          {/* ── Invoice content — always white/light (for printing) ── */}
          <div ref={printRef}
            className="bg-white max-w-4xl mx-auto rounded-2xl shadow-sm
                       border border-gray-200 p-4 sm:p-5 md:p-6 text-[13px]">

            {/* Invoice header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start
                            gap-6 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700">FeedMill Pro</h1>
                <p className="text-sm text-gray-500 mt-1">Animal Feed Manufacturing System</p>
              </div>
              <div className="md:text-right">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-800">Invoice</h2>
                <p className="text-sm text-gray-500 mt-2">#{order._id?.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">Date: {invoiceDate}</p>
                <div className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  order.status === "Completed" ? "bg-emerald-100 text-emerald-700"
                  : order.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
                }`}>
                  {order.status}
                </div>
              </div>
            </div>

            {/* Bill section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { label:"Bill To",         main:order.customerName, sub:"Customer" },
                { label:"Formula",         main:formulaName,        sub:formulaCode },
                { label:"Order Reference", main:`#${order._id?.slice(-8).toUpperCase()}`, sub:invoiceDate, right:true },
              ].map(({ label, main, sub, right }) => (
                <div key={label} className={right ? "md:text-right" : ""}>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
                  <h3 className="text-lg font-bold text-gray-800">{main}</h3>
                  <p className="text-sm text-gray-500 mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[700px] border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {["#","Description","Quantity","Unit","Price / kg","Amount"].map((h, i) => (
                      <th key={h} className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-4 text-sm text-gray-700">1</td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-800">{formulaName}</div>
                      <div className="text-xs text-gray-400 mt-1">{formulaCode}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {order.quantityKG?.toLocaleString()} kg
                      <div className="text-xs text-gray-400 mt-1">({order.quantity} {order.unit})</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">kg</td>
                    <td className="px-4 py-4 text-sm text-gray-700">Rs {order.price?.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right font-bold text-gray-800">Rs {order.totalPayment?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-full sm:w-[340px] space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs {order.totalPayment?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-y-2 border-emerald-700 py-3 text-base font-extrabold text-emerald-700">
                  <span>Total</span>
                  <span>Rs {order.totalPayment?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2 text-sm font-semibold text-emerald-600">
                  <span>Payment Received</span>
                  <span>Rs {order.paymentPaid?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-yellow-600">
                  <span>Balance Due</span>
                  <span>Rs {order.paymentPending?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment progress */}
            <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Payment Progress</p>
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width:`${paidPct}%` }} />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-sm">
                <span className="text-emerald-600 font-semibold">
                  Paid: Rs {order.paymentPaid?.toLocaleString()} ({paidPct}%)
                </span>
                <span className="text-yellow-600 font-semibold">
                  Due: Rs {order.paymentPending?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Thank you for your business with{" "}
                <span className="font-bold text-emerald-700">FeedMill Pro</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Generated on {new Date().toLocaleDateString("en-PK", { year:"numeric", month:"long", day:"numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceModal;