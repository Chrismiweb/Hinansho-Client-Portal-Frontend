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
      <td className="text-[14px] font-bold flex flex-col gap-1">
        {issue}
        <span className="text-[12px] font-normal text-[#62748E]">By {requester}</span>
      </td>

      <td className="text-[14px] font-semibold">
        {location} <br/>
        <span className="text-[12px] font-normal text-[#62748E]">{unit}</span>
      </td>

      <td className="text-[14px]">{date}</td>

      <td
        className={` text-xs flex px-3 py-1 justify-center items-center mt-[12px] max-w-[70px] rounded-full ${
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
          className={`text-xs px-3 py-1 rounded-full ${
            status === "Completed"
              ? "bg-[#DCFCE7] text-[#008236]"
              : "bg-[#FEF3C6] text-[#BB4D00]"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="text-right text-[20px]"><RxBorderDotted/></td>
    </tr>
  );
}
