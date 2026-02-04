import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";
import { PaymentHistory } from "./PaymentHistory";

export default function PaymentHistoryMobile() {
  return (
    <div className="space-y-4 flex md:hidden flex-col w-full px-4">
      {/* Header */}
      <div className="inline-block bg-white px-5 w-[80%] py-3 rounded-xl shadow-sm border border-[#F1F5F9]">
        <h3 className="text-[20px] font-semibold">Payment History</h3>
      </div>

      {/* List */}
      <div className="space-y-4">
        {PaymentHistory.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[22px] p-4 border border-[#F1F5F9] shadow-sm flex justify-between items-start"
          >
            {/* Left */}
            <div className="space-y-1">
              <p className="text-[13px] text-[#94A3B8]">{item.date}</p>

              <p className="text-[18px] font-semibold text-[#0F172A] w-[60%] leading-snug">
                {item.title}
              </p>

              <p className="text-[14px] text-[#94A3B8]">{item.id}</p>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    item.type === "income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
              >
                {item.type === "income" ? (
                  <GoArrowUpRight />
                ) : (
                  <GoArrowDownLeft />
                )}
              </div>

              <p className="text-[18px] font-bold">{item.amount}</p>

              <div className="flex items-center gap-2 text-[14px]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.status === "Completed"
                      ? "bg-green-500"
                      : "bg-orange-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    item.status === "Completed"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
