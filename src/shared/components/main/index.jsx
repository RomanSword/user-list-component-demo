import React from 'react'

import './styles.scss'

const MainComponent = ({ children }) => {
  return (
    <main className='main'>
      {children}
    </main>
  )
}

export default MainComponent
