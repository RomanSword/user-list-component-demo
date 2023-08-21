import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import debounce from '../../../shared/helpers/debounce'
import TextInputComponent from '../textInput'
import ButtonComponent from '../button'

import UserListItemComponent from './listItem'
import UserListModal from './modal'
import { keyLabelListDicts, tempListId, tempLoadingId } from './constants'

import './styles.scss'

export default class UserListComponent extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    isLoadingMore: PropTypes.bool,
    list: PropTypes.array,
    sortKey: PropTypes.string,
    searchText: PropTypes.string,
    loadMore: PropTypes.func,
    sortByKey: PropTypes.func,
    searchByText: PropTypes.func,
  }

  static defaultProps = {
    isLoaded: false,
    isLoading: false,
    isLoadingMore: false,
    sortKey: '',
    searchText: '',
    loadMore: () => null,
    sortByKey: () => null,
    searchByText: () => null
  }

  state = {
    isModalVisible: false,
    isEditModeEnabled: false,
    selectedItem: null
  }

  componentDidMount() {
    this.startListFullVisibilityCheck()
  }

  // Проверяем, появился ли скролл для списка. Если нет, то догружаем еще данные
  startListFullVisibilityCheck = () => {
    const { isLoaded, isLoadingMore, loadMore } = this.props

    if (isLoadingMore || isLoaded) {
      return
    }

    const loadingElement = document.getElementById(tempLoadingId)
    const element = document.getElementById(tempListId)

    if (element && !loadingElement) {
      const rect = element.getBoundingClientRect()

      if (rect.height <= document.documentElement.clientHeight) {
        loadMore()
        setTimeout(this.startListFullVisibilityCheck, 1000)
      }
    } else {
      setTimeout(this.startListFullVisibilityCheck, 1000)
    }
  }

  // Обрабатываем частые скроллы вниз и учитываем только последний
  onScroll = debounce(event => {
    const { isLoaded, isLoadingMore, loadMore } = this.props

    if (isLoadingMore || isLoaded) {
      return
    }

    const element = event.target

    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
      loadMore()
    }
  })

  // Если зажали на кнопку перемещения элемента, то накидываем на него обработчики перетаскивания
  onMouseDownRelocate = event => {
    const element = event.target.closest('.user-list-relocate')

    if (element) {
      this.listItemElement = event.target.closest('.user-list-item')
      this.listItemElement.setAttribute('draggable', false)

      this.listElement = document.getElementById(this.props.id)

      event.stopPropagation()
      this.listItemElement.setAttribute('draggable', true)

      this.listElement.addEventListener('dragstart', this.handleDragStart)
      this.listElement.addEventListener('dragover', this.handleDragOver)
      this.listElement.addEventListener('dragend', this.handleDragEnd)
    }
  }

  // Сработает как только перетаскивание началось
  handleDragStart = event => {
    event.dataTransfer.dropEffect = 'move'
  }

  // Сработает как только перетаскивание закончилось
  handleDragEnd = () => {
    this.listElement.removeEventListener('dragstart', this.handleDragStart)
    this.listElement.removeEventListener('dragover', this.handleDragOver)
    this.listElement.removeEventListener('dragend', this.handleDragEnd)

    this.listItemElement.setAttribute('draggable', false)
  }

  // Срабатывает при перемещении объекта и отдает элемент, над которым находится курсор
  // Потом вызывает рассчет куда вставлять перемещаемый элемент и он вставляется в новое место
  handleDragOver = event => {
    event.preventDefault()

    const draggableListItem = this.listItemElement
    const hoveredListItem = event.target.closest('.user-list-item')

    if (!hoveredListItem || hoveredListItem === draggableListItem) {
      return
    }

    const insertionPosition = this.getInsertedPositionFromListItem(event)

    if (insertionPosition) {
      hoveredListItem.insertAdjacentElement(insertionPosition, draggableListItem)
    }
  }

  // Метод для расчета куда вставлять перемещаемый элемент
  // Берется элемент под курсором, делится по горизонтали
  // Если курсор попадает на его верхнюю часть, то перетаскиваемый элемент вставляется перед целевым
  // Если курсор попадает на нижнюю - вставляется после целевого
  getInsertedPositionFromListItem = event => {
    const cursorYCoordinate = event.clientY
    const listItemElement = event.target.closest('.user-list-item')

    const offsetFold = 4
    const elementOffsetDivided = listItemElement.offsetHeight / offsetFold
    const elementYCoordinate = listItemElement.getBoundingClientRect().top

    const offsetMultiplier = 2
    const elementFirstOffset = elementYCoordinate + 0
    const elementSecondOffset =
      elementYCoordinate + listItemElement.offsetHeight - elementOffsetDivided * offsetMultiplier
    const elementThirdOffset = elementYCoordinate + listItemElement.offsetHeight - elementOffsetDivided
    const elementFourthOffset = elementYCoordinate + listItemElement.offsetHeight

    let position = ''

    if (elementFirstOffset < cursorYCoordinate && cursorYCoordinate < elementSecondOffset) {
      position = 'beforebegin'
    } else if (elementThirdOffset < cursorYCoordinate && cursorYCoordinate < elementFourthOffset) {
      position = 'afterend'
    }

    return position
  }

  onShowItem = selectedItem => {
    this.setState({
      selectedItem,
      isModalVisible: true
    })
  }

  onEditItem = selectedItem => {
    this.setState({
      selectedItem,
      isModalVisible: true,
      isEditModeEnabled: true
    })
  }

  onSubmitItem = updatedItem => {
    this.onCloseModal()
    this.props.updateUser(updatedItem)
  }

  onCloseModal = () => {
    this.setState({
      selectedItem: null,
      isModalVisible: false,
      isEditModeEnabled: false
    })
  }

  render() {
    const { isModalVisible, isEditModeEnabled, selectedItem } = this.state
    const {
      id, isLoaded, isLoading, isLoadingMore,
      list, sortKey, searchText,
      sortByKey, searchByText
    } = this.props

    let contentElement = null

    if (isLoading) {
      contentElement = (
        <div className='user-list-message'>
          Загрузка...
        </div>
      )
    } else if (list.length === 0) {
      contentElement = (
        <div className='user-list-message'>
          Список пуст
        </div>
      )
    } else {
      contentElement = (
        <ul id={tempListId} className='list user-list'>
          {list.map(item => (
            <UserListItemComponent
              key={item.id}
              item={item}
              onEdit={this.onEditItem}
              onShow={this.onShowItem}
            />
          ))}
        </ul>
      )
    }

    return (
      <>
        <div className='user-list-container'>
          <div className='user-list-panel'>
            <TextInputComponent
              id='search-text-input'
              placeholder='Введите текст для поиска...'
              value={searchText}
              onChange={searchByText}
            />

            <ButtonComponent
              text='Сбросить'
              onClick={() => searchByText('')}
            />
          </div>

          <div
            id={id}
            className='user-list-wrapper'
            onScroll={this.onScroll}
            onMouseDown={this.onMouseDownRelocate}
          >
            <header className='user-list-header user-list-item'>
              {keyLabelListDicts.map(({ key, label }, index) => (
                <span
                  key={index}
                  onClick={() => sortByKey(key)}
                  className='user-list-column user-list-header-item'
                  data-is-selected={sortKey === key}
                >
                  {label}
                </span>
              ))}

              <span className='user-list-column'></span>
            </header>

            {contentElement}

            {isLoadingMore && (
              <div
                id={tempLoadingId}
                className='user-list-message user-list-message_floating-bottom'
              >
                Догрузка списка...
              </div>
            )}

            {isLoaded && (
              <div className='user-list-message'>
                Конец списка
              </div>
            )}
          </div>
        </div>

        <UserListModal
          selectedItem={selectedItem}
          isVisible={isModalVisible}
          isEditMode={isEditModeEnabled}
          onEdit={this.onEditItem}
          onSubmit={this.onSubmitItem}
          onClose={this.onCloseModal}
        />
      </>
    )
  }
}
