import React from 'react'
import PortfolioList from './PortfolioList'

function PortfolioPage() {
  return (
    <div>
        <PortfolioList/>
    </div>
  )
}

export default PortfolioPage

    // <div className="p-8">
    //   <h1 className="text-[26px] md:text-[30px] font-bold">My Portfolio</h1>
    //   <p className="text-[#62748E] text-[14px] md:text-[16px] mb-6">
    //     Manage and track your real estate investments.
    //   </p>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {portfolios.map(p => (
    //       <PortfolioCard key={p.id} data={p} />
    //     ))}
    //   </div>
    // </div>
    //     <div>
    //   <h1 className="text-xl font-semibold">Our Properties</h1>
    //   <PortfolioCard /> {/* Displays the portfolio cards */}
    // </div>