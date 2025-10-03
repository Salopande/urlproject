import React from 'react'

const Error = ({message}) => {
  return (
    <span className='text-sm text-red-400'>{String(message)}</span>
  )
}

export default Error