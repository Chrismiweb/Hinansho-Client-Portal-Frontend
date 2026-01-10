import { GoArrowUpRight } from "react-icons/go";
import { GoArrowDownLeft } from "react-icons/go";
import { RxDotFilled } from "react-icons/rx";
export default function RecentActivities() {
  return (
    <div className=" py-[40px] px-[38px] border-2 border-[#F1F5F9] rounded-3xl bg-white shadow-sm">
      <div className="flex justify-between mb-7">
        <h3 className="font-semibold text-[24px]">Recent Activities</h3>
        <span className="text-[16px] text-[#62748E]">Filter</span>
      </div>

      <div className="space-y-4">
        <Activity
          title="Monthly Rent - Unit 304"
          amount="$25,500"
          status="Completed"
          date="17 Apr, 2024"
          icon={<GoArrowUpRight />}
          dot = {<RxDotFilled />}
          refNo = "INV_00076"
          green
        />
        <Activity
          title="Plumbing Repair"
          amount="$32,750"
          status="Pending"
          date="15 Apr, 2024"
          icon={<GoArrowDownLeft />}
          refNo = "INV_00075"
          dot = {<RxDotFilled />}

        />
        <Activity
          title="Security Deposit Return"
          amount="$40,200"
          status="Completed"
          date="15 Apr, 2024"
          icon={<GoArrowUpRight />}
          dot = {<RxDotFilled />}
          refNo = "INV_00074"
          green

        />
      </div>
    </div>
  );
}

function Activity({ title, amount, status, date, icon, green, refNo,dot }) {
  const isCompleted = status === "Completed";

  return (
    <div className="flex items-center justify-between">
            {/* <div
      className={`rounded-2xl px-6 pt-[24px] pb-[28px] ${
        dark
          ? "bg-[#0F172B] text-white"
          : "bg-white shadow-lg border-2 border-[#F1F5F9]"
      }`}
    > */}
        <div className={` text-[25px] p-3 rounded-2xl ${green ? 'bg-[#F0FDF4] text-[#00A63E]' : 'bg-[#FEF2F2] text-[#E7000B]' } inline-block mr-4`}>
            {icon}
        </div>
      <div className="w-[20%] ">
        <p className="text-[18px] font-semibold">{title}</p>
        <p className="text-[14px] text-[#90A1B9]">{refNo}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium">{amount}</p>
      </div>
        <p
            className={`text-[14px] flex items-center font-bold ${
            isCompleted ? "text-[#00A63E]" : "text-[#DDA04E]"
            }`}
        >
           <span className="text-[20px]"> {dot}</span>
            {status}
        </p>
        <p className="text-[16px] text-[#90A1B9]">{date}</p>
        
    </div>
  );
}
