import React from 'react'

import './styles.scss'

const ModalComponent = ({
  title = '',
  onClose = () => null,
  children,
}) => {
  return (
    <div className='modal-container'>
      <div className='modal-background'></div>

      <div className='modal-wrapper'>
        <div className='modal'>
          <header className='modal-dialog-header'>
            <h2 className='title modal-dialog-title'>
              {title}
            </h2>

            <button
              className='modal-dialog-close-button'
              onClick={onClose}
            >
              Закрыть
            </button>
          </header>

          <div className='modal-dialog-body'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalComponent
