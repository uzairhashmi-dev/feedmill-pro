import { PAYMENT_STATUS } from "../constants";

const PaymentBadge = ({ hasOutstanding }) => {
  const cfg = hasOutstanding ? PAYMENT_STATUS.outstanding : PAYMENT_STATUS.clear;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
                      rounded-lg text-xs font-semibold
                      ${cfg.bg} ${cfg.text}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};
export default PaymentBadge;