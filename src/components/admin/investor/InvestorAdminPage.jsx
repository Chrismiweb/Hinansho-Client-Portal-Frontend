import React from 'react'
import OverviewCards from './OverviewCards'
import TransactionsTable from './TransactionsTable'

function InvestorAdminPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full lg:items-start lg:justify-start justify-center items-center flex flex-col">

        <OverviewCards />
        <TransactionsTable />
      </div>
    </div>
  )
}

export default InvestorAdminPage