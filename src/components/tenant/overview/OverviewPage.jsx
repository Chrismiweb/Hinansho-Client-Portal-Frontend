import PaymentOverview from "./PaymentOverview";
import MaintenanceRequests from "./MaintenanceRequests";

export default function OverviewPage() {
  return (
    <div className=" min-h-screen flex flex-col gap-[40px] pb-[40px]">
      {/* Payment Overview Section */}
      <PaymentOverview
        dueDate="July 1, 2024"
        amount="850.00"
        status="Pending"
      />

      {/* Maintenance Requests Section */}
      <MaintenanceRequests />
    </div>
  );
}
