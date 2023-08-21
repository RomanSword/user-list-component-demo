import React from 'react'

import ModalComponent from '../modal'
import LabelValueComponent from '../labelValue'
import ButtonComponent from '../button'

import UserFormComponent from './form'
import { keyLabelDetailDicts } from './constants'
import './styles.scss'

const UserListModal = ({
  selectedItem = {},
  isVisible = false,
  isEditMode = false,
  onEdit = () => null,
  onSubmit = () => null,
  onClose = () => null
}) => {

  if (!isVisible) {
    return null
  }

  let content = null

  if (isEditMode) {
    content = (
      <UserFormComponent
        form={selectedItem}
        onSubmit={onSubmit}
      />
    )
  } else {
    content = (
      <>
        {keyLabelDetailDicts.map(item => (
          <LabelValueComponent
            key={`LabelValue_${item.key}`}
            label={item.label}
            value={selectedItem[item.key]}
          />
        ))}

        <div className='user-list-submit-panel'>
          <ButtonComponent
            text='Редактировать'
            onClick={() => onEdit(selectedItem)}
          />
        </div>
      </>
    )
  }

  return (
    <ModalComponent
      title={isEditMode ? 'Редактирование записи' : 'Просмотр записи'}
      onClose={onClose}
    >
      {content}
    </ModalComponent>
  )
}

export default UserListModal
