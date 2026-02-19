// components/PortfolioCard.jsx
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";

export default function PortfolioCard({ data }) {

  return (
    <div className="bg-white border border-[#0000001A] rounded-2xl">
      <img
        src={data.image}
        className="rounded-t-xl h-50 w-full object-cover"
      />

        <div className="pt-[29px] pb-[17px] px-[25px]">
            <h3 className="text-[22px] text-[#0A0A0A] font-semibold">{data.name}</h3>
            <p className="text-[16px] text-[#717182]"><IoLocationOutline className="inline mr-1" />{data.location}</p>

            <div className="mt-5 space-y-2 text-sm">
                <div className="flex text-[14px] justify-between">
                    <span className="text-[#62748E]">Type</span>
                    <span>{data.type}</span>
                </div>
                <div className="flex text-[14px] justify-between">
                    <span className="text-[#62748E]">Occupancy</span>
                    <span>{data.occupancy}</span>
                </div>
                <div className="flex text-[14px] justify-between">
                    <span className="text-[#62748E]">Total Units</span>
                    <span>{data.totalUnits}</span>
                </div>
            </div>
            <Link href={`/dashboard/portfolio/${data.id}`}
                className="mt-5 block w-full bg-slate-900 text-white rounded-lg py-2 text-center"
            >
                View Details →
            </Link>
        </div>

    </div>
  );
}
