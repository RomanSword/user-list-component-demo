import React from 'react'

import './styles.scss'

const LabelValueComponent = ({
  label,
  value
}) => {
  return (
    <div className='label-value'>
      <span className='label'>
        {label}
      </span>

      <span className='value'>
        {value}
      </span>
    </div>
  )
}

export default LabelValueComponent
