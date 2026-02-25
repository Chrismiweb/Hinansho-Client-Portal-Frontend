import DashboardShell from '@/components/layout/DashboardShell'
import ProtectedLayout from '@/components/layout/ProtectedLayout'

export default function AdminLayout({ children }) {
  return (
    <ProtectedLayout>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedLayout>
  )
}
