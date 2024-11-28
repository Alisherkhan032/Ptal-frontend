import React from 'react'
import Link from 'next/link'    

const ProductFlowSingle = ({numberOfProduct, link,linkName, startDate, endDate}) => {
  return (
    <div className="ml-6 mb-4 text-gray-500 font-medium">
          <div className="mb-1">
            <span className="text-2xl font-bold text-gray-800">{numberOfProduct}</span>
            <span className="mx-2">Products</span>
          </div>
          <div >
            <Link href={link} target="_blank" rel="noopener noreferrer">
              <span className="font-medium  text-[#4FC9DA] hover:text-[#45aab8]">
              {linkName}
              </span>
            </Link>
            <div className='font-normal text-sm'>
              <span >{startDate}</span>
              <span> to </span>
              <span>{endDate}</span>
            </div>
          </div>
    </div>
  )
}

export default ProductFlowSingle