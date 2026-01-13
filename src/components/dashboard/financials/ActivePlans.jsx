"use client";
import { useState } from "react";
import PlanCard from "./PlanCard";
import PaymentModal from "./PaymentModal";

export default function ActivePlans() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // The handler that will open the modal and pass the correct plan
  const handlePay = (plan) => {
    setSelectedPlan(plan);
    setOpenModal(true);
  };
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
          onPay={() =>
            handlePay({
              type: "initial", // Add type to differentiate the plan
              title: "Official Business Account",
              next: "$5,000",
            })
          }
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
            onPay={() =>
            handlePay({
              type: "renovation", // Add type for Renovation Fund
              title: "Renovation Fund",
              next: "$3,000",
            })
          }
        />
      </div>

            {/* Payment Modal */}
      <PaymentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)} // Close modal on cancel
        plan={selectedPlan}
      />
    </div>
  );
}
