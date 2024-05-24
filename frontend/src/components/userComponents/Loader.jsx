import React from 'react'
import {BarLoader} from 'react-spinners'

const Loader = () => {
  return (
    <div className=" mt-4 items-center bg-indigo-200">
    <BarLoader color={'#4B0082'} loading={true} />
  </div>
  )
}

export default Loader