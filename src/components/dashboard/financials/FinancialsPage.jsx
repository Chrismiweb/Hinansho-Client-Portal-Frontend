import React from 'react'
import StatsSummary from './StatsSummary'
import ActivePlans from './ActivePlans'
import TransactionHistory from './TransactionHistory'
import PaymentHistoryMobile from './PaymentHistoryMobile'

function FinancialsPage() {
  return (
    <div className='flex flex-col w-full items-center lg:items-start gap-[35px] pb-[200px]'>
        <StatsSummary/>
        <ActivePlans/>
        <TransactionHistory />
        <PaymentHistoryMobile/>

    </div>
  )
}

export default FinancialsPage