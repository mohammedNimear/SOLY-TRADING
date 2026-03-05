import React from 'react'

const LoadingSpinner = () => {
  return (
    <div>
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600">
              
            </div>
        </div>
    </div>
  )
}

export default LoadingSpinner