import React from 'react'

function OverviewPage() {
     return (
    <div className="flex-1 p-8 bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl">Good morning, Alex!</h1>
          <p className="text-gray-500">Here’s what’s happening with your portfolio today.</p>
        </div>
        <div className="text-xl text-gray-600">
          Total Balance: $689,372.00 <br />
          <span className="text-green-500">+5% more than last month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-900 text-white p-4 rounded-lg">
          <h3>Total Earnings</h3>
          <p className="text-lg">$22,678.00</p>
          <span className="text-green-500">+5%</span>
        </div>
        <div className="bg-blue-900 text-white p-4 rounded-lg">
          <h3>Properties</h3>
          <p className="text-lg">12</p>
          <span className="text-green-500">+9%</span>
        </div>
        <div className="bg-blue-900 text-white p-4 rounded-lg">
          <h3>Documents</h3>
          <p className="text-lg">15</p>
          <span className="text-green-500">Up to date</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl mb-4">Recent Activities</h2>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 flex justify-between rounded-lg">
            <p>Monthly Rent - Unit 304</p>
            <p className="text-green-500">$25,500 <span className="text-xs">Completed</span></p>
          </div>
          <div className="bg-gray-100 p-4 flex justify-between rounded-lg">
            <p>Plumbing Repair</p>
            <p className="text-yellow-500">$32,750 <span className="text-xs">Pending</span></p>
          </div>
          <div className="bg-gray-100 p-4 flex justify-between rounded-lg">
            <p>Security Deposit Return</p>
            <p className="text-green-500">$40,200 <span className="text-xs">Completed</span></p>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default OverviewPage