import React from 'react'
import StatsSummary from './StatsSummary'
import ActivePlans from './ActivePlans'
import TransactionHistory from './TransactionHistory'

function FinancialsPage() {
  return (
    <div className='flex flex-col gap-[35px]'>
        <StatsSummary/>
        <ActivePlans/>
        <TransactionHistory />

    </div>
  )
}

export default FinancialsPage