import { TbBuildingSkyscraper } from "react-icons/tb";
import { MdOutlineFileUpload } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";

export default function InitialInvestmentPayment({ plan, onClose }) {
  return (
    <>
      {/* Header */}
      <div className="bg-[#0F172B] gap-[7px] flex flex-col text-white px-6 py-[23px]">
        <h2 className="text-[20px] font-semibold">Make Payment</h2>
        <p className="text-sm text-[#90A1B9]">
          Transfer funds to our account and upload the receipt.
        </p>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-[16px]">
        <div className="bg-[#F8FAFC] border-[#F1F5F9] p-4 rounded-2xl border-2">
          <div className="flex gap-3 items-center mb-3">
            <div className="p-[10px] bg-white border-[#E2E8F0] rounded-[10px] border">
              <TbBuildingSkyscraper className="text-[#DDA04E] text-[25px]" />
            </div>
            <div>
              <p className="font-semibold text-[14px]">Hinansho Management</p>
              <p className="text-[12px] text-[#62748E]">{plan.title}</p>
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <div className="flex justify-between">
                <p className="text-[#62748E] text-[12px">Bank</p>
                <p className="font-semibold text-[14px]">First Bank Of Nigeria</p>
            </div>
            <div className="flex justify-between">
                <p className="text-[#62748E] text-[12px">Account No.</p>
                <p className="font-semibold text-[14px]">319-399-0012</p>
            </div>
            <div className="flex justify-between">
                <p className="text-[#62748E] text-[12px">Total Amount Due</p>
                <p className="font-semibold text-[14px]">{plan.next}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
            <p className="text-[#314158] text-[14px] font-bold">Upload Receipt</p>
            <label className="border-2 border-[#E2E8F0] gap-[8px] rounded-[14px] p-6 flex flex-col items-center cursor-pointer">
                <input type="file" hidden />
                <div className="text-[#90A1B9] bg-[#F8FAFC] p-[10px] text-[30px] rounded-full flex justify-center items-center"><MdOutlineFileUpload/></div>
                <p className="font-medium text-[14px]">Click to upload receipt</p>
                <p className="text-[12px] text-[#62748E]">JPG, PNG or PDF (Max 5MB)</p>
            </label>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-[#E2E8F0] text-[14px] rounded-[14px] py-3">
            Cancel
          </button>
          <button className="flex-1 border-2 border-[#E2E8F0] bg-[#DDA04E] text-white text-[14px] rounded-[14px] py-3">
            Submit Payment
          </button>
        </div>
      </div>
    </>
  );
}
