import PlanCard from "./PlanCard";

export default function ActivePlans() {
  return (
    <div>
      <h3 className="text-[23px] font-bold mb-[30px]">Active Plans</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlanCard
          title="Initial Investment Capital"
          subtitle="The Pavilion Hostel"
          progress={70}
          paid="$35,000"
          total="$50,000"
          remaining="$15,000"
          next="$5,000"
          frequency="Monthly"
          due="2024-05-15"
        />

        <PlanCard
          title="Renovation Fund"
          subtitle="Green Valley Estate"
          progress={25}
          paid="$3,000"
          total="$12,000"
          remaining="$9,000"
          next="$3,000"
          frequency="Quarterly"
          due="2024-06-01"
        />
      </div>
    </div>
  );
}
