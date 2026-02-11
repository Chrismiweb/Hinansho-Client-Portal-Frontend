import { RxBorderDotted } from "react-icons/rx";
export default function TransactionRow({
  id,
  desc,
  type,
  date,
  status,
  amount,
  positive,
  issue,
  requester,  location,
  priority,   
  unit  
  
}) {
  return (
    <tr>
      <td className="py-4 text-[#62748E]">{id}</td>
      <td className="text-sm lg:text-[14px] font-semibold md:font-bold flex flex-col gap-1">
        {issue}
        <span className="text-[10px] lg:text-[12px] font-normal text-[#62748E]">By {requester}</span>
      </td>

      <td className="text-sm lg:text-[14px] font-semibold">
        {location} <br/>
        <span className="text-[10px] lg:text-[12px] font-normal text-[#62748E]">{unit}</span>
      </td>

      <td className="text-[12px] lg:text-[14px] hidden md:table-cell">{date}</td>

      <td
        className={` text-xs md:flex hidden px-3 py-1 justify-center items-center mt-[12px] max-w-[70px] rounded-full ${
          priority === "High"
              ? "bg-[#FEF2F2] text-[#C10007]"
              : priority === "Medium"
              ? "bg-[#FFFBEB] text-[#BB4D00]"
              : "bg-[#DCFCE7] text-[#008236]" 
        }`}
      >
        {priority}
      </td>
      
      <td>
        <span
          className={`text-xs hidden md:table-cell px-3 py-1 rounded-full ${
            status === "Completed"
              ? "bg-[#DCFCE7] text-[#008236]"
              : "bg-[#FEF3C6] text-[#BB4D00]"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="text-right hidden md:table-cell text-[16px] lg:text-[20px]"><RxBorderDotted/></td>
    </tr>
  );
}
