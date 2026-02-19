import { RxBorderDotted } from "react-icons/rx";
export default function TransactionRow({
  id,
  desc,
  type,
  date,
  status,
  amount,
  positive,
}) {
  return (
    <tr>
      <td className="py-4 text-[#62748E]">{id}</td>
      <td>
        <p>{desc}</p>
        <span className="text-xs text-[#90A1B9]">{type}</span>
      </td>
      <td className="text-gray-500">{date}</td>
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
      <td
        className={` font-medium ${
          positive ? "text-[#00A63E]" : ""
        }`}
      >
        {amount}
      </td>
      <td className="text-right text-[20px]"><RxBorderDotted/></td>
    </tr>
  );
}
