import React, { useState } from 'react'

import './styles.scss'

const ActionsSelectorComponent = ({
  children
}) => {
  const [isVisible, changeVisibility] = useState(false)

  const onClickAway = event => {
    if (event.target.className !== 'actions-selector-content') {
      changeVisibility(false)
      document.removeEventListener('click', onClickAway)
    }
  }

  const onPress = () => {
    const newValue = !isVisible

    changeVisibility(newValue)

    setTimeout(() => {
      if (newValue) {
        document.addEventListener('click', onClickAway)
      } else {
        document.removeEventListener('click', onClickAway)
      }
    })
  }

  return (
    <div className='actions-selector'>
      <button
        className='actions-selector-button'
        onClick={onPress}
      >
        <i className='icon icon_regular icon_dots'></i>
      </button>

      {isVisible && (
        <div className='actions-selector-content'>
          {children}
        </div>
      )}
    </div>
  )
}

export default ActionsSelectorComponent
