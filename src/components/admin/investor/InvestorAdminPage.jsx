'use client'

import React, { useRef } from 'react'
import OverviewCards from './OverviewCards'
import FetchInvestorsStyled from './FetchInvestors'
import SyncFromSheet from './SyncFromSheet'
// import SendLoginDetails from './SendLoginDetails'

function InvestorAdminPage() {
  // This ref lets SyncFromSheet trigger a refetch inside FetchInvestorsStyled
  const refetchRef = useRef(0)

  const triggerRefetch = () => {
    refetchRef.current += 1
  }

  return (
    <div className="min-h-screen">
      <div className="w-full lg:items-start lg:justify-start justify-center items-center flex flex-col">
        <OverviewCards />
        {/* <SendLoginDetails /> */}
        <SyncFromSheet onSyncComplete={triggerRefetch} />
        <FetchInvestorsStyled refetchTrigger={refetchRef.current} />
      </div>
    </div>
  )
}

export default InvestorAdminPage
