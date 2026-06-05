// This layout is the shared wrapper for all dashboard routes.
// Role-specific layouts (admin, dashboard, tenant) each wrap with
// ProtectedLayout + DashboardShell. This parent just passes children through.
export default function DashboardGroupLayout({ children }) {
  return <>{children}</>;
}
