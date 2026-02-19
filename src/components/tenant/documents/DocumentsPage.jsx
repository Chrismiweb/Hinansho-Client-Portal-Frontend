import React from 'react'
import SectionOne from './SectionOne'
import SectionTwo from './SectionTwo'

function DocumentsPage() {
  return (
        <div className="flex flex-col gap-5 items-center justify-center lg:items-start lg:justify-start w-full ">
      <SectionOne />
      <SectionTwo />
    </div>
  )
}

export default DocumentsPage