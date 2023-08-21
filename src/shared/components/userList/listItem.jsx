import React from 'react'

import ActionsSelectorComponent from '../actions-selector'

import { keyLabelListDicts } from './constants'

import './styles.scss'

const UserListItemComponent = ({
  item,
  onShow = () => null,
  onEdit = () => null
}) => {
  return (
    <li
      className='user-list-item'
      draggable='false'
    >
      {keyLabelListDicts.map(({ key }, index) => {
        return (
          <span key={index} className='user-list-column'>
            {item[key] ? item[key] : null}
          </span>
        )
      })}

      <span className='user-list-column'>
        <span className='user-list-action user-list-relocate'>
          <i className='icon icon_regular icon_relocate'></i>
        </span>

        <ActionsSelectorComponent>
          <span onClick={() => onShow(item)}>
            Просмотреть
          </span>

          <span onClick={() => onEdit(item)}>
            Редактировать
          </span>
        </ActionsSelectorComponent>
      </span>
    </li>
  )
}

export default UserListItemComponent
