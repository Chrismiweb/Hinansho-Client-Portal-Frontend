import { TbBuildingSkyscraper } from "react-icons/tb";
import { GoArrowUpRight } from "react-icons/go";

export default function PlanCard({
  title,
  subtitle,
  progress,
  paid,
  total,
  remaining,
  next,
  frequency,
  due,
  onPay,
}) {
  return (
    <div className="bg-white rounded-[37px] pt-[37px] pb-[70px] px-[20px] lg:px-[40px] border-2 border-[#F1F5F9]">
      <div className="flex w-full justify-between mb-6">
        <div  className="flex items-center justify-center gap-[18px]">
            <div className="p-[13px] bg-[#F8FAFC] border-2 border-[#F1F5F9] rounded-[18px]">
                <TbBuildingSkyscraper className="text-[25px] " />
            </div>
            <div>
                <h4 className="font-semibold text-[20px]">{title}</h4>
                <p className="text-[16px] text-[#62748E]">{subtitle}</p>
            </div>
        </div>
        <div className="text-xs bg-[#F0FDF4]  rounded-[10px] px-[10px] text-[#008236] border border-[#B9F8CF] flex items-center justify-center font-semibold">
          Active
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[16px] text-[#62748E]">Progress</span>
          <span className="text-[16px] font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#0F172A] h-2 rounded-full"
            style={{ width: `${progress}%` }}  />
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span className="text-[#90A1B9] text-[14px]">Paid: {paid}</span>
        <span className="text-[#90A1B9] text-[14px]">Total: {total}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-[#F1F5F9] rounded-xl mb-4">
        <div>
          <p className="text-[14px] text-[#90A1B9]">REMAINING</p>
          <p className="font-bold text-[20px]">{remaining}</p>
        </div>
        <div>
          <p className="text-xs text-[#90A1B9]">NEXT INSTALLMENT</p>
          <p className="font-bold text-[20px] text-[#DDA04E]">
            {next} <span className="text-[#62748E] font-medium bg-[#FFFFFF] px-[5px] border-1 rounded-[6px] border-[#E2E8F0] py-[3px] text-[12px] px-[8px]">{frequency}</span>
          </p>
          <p className="text-[14px] text-[#90A1B9]">Due {due}</p>
        </div>
      </div>

      <div className="flex md:gap-3 lg:gap-0 gap-0 justify-between md:justify-start lg:justify-between">
        <button onClick={onPay} className="flex items-center justify-center px-[35px] md:px-[100px] lg:px-[100px] bg-[#0F172A] text-white py-2 rounded-lg text-[16px] md:text-[20px] lg:text-[16px]">
          Pay Installment <GoArrowUpRight className="hidden md:flex"/>
        </button>
        <button className="border lg:px-4 border-[#E2E8F0] px-[20px] rounded-lg lg:text-[16px] md:text-[20px] text-[16px]">
          Details
        </button>
      </div>
    </div>
  );
}
