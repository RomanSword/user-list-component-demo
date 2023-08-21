import { useEffect, useState } from 'react'

import userService from '../shared/services/userService'

import MainHeaderComponent from '../shared/components/mainHeader'
import MainComponent from '../shared/components/main'
import UserListComponent from '../shared/components/userList'

import '../shared/styles/index.scss'

let currentPage = 0

const getUsers = async params => {
  let response = []

  try {
    response = await userService.getUsers(params)
  } catch (error) {
    console.log(error)
  }

  return response
}

function App() {
  const [isLoading, changeIsLoading] = useState(false)
  const [isLoadingMore, changeIsLoadingMore] = useState(false)
  const [isLoaded, changeIsLoaded] = useState(false)
  const [sortKey, changeSortKey] = useState('')
  const [searchText, changeSearchText] = useState('')
  const [users, changeUsers] = useState([])

  const loadUsers = async () => {
    changeIsLoading(true)

    const newData = await getUsers({})

    changeUsers(newData)
    userService.saveUsers(newData)

    changeIsLoading(false)
  }

  // После догрузки новых данных сбрасывается примененная сортировка
  const loadMoreUsers = async () => {
    if (isLoadingMore) {
      return
    }

    currentPage = currentPage + 1

    changeIsLoadingMore(true)

    if (sortKey !== '') {
      changeSortKey('')
    }

    if (searchText !== '') {
      changeSearchText('')
    }

    const newData = await getUsers({ page: currentPage })
    const updatedData = userService.list.concat(newData)

    changeUsers(updatedData)
    userService.saveUsers(updatedData)

    if (newData.length === 0) {
      changeIsLoaded(true)
    }

    changeIsLoadingMore(false)
  }

  // Либо сбрасываем сортировку, либо сортируем имеющиеся данные в списке по ключу
  const sortUsersByKey = newKey => {
    if (newKey === sortKey) {
      changeSortKey('')
      changeUsers(userService.list)
    } else {
      changeSortKey(newKey)
      changeUsers(
        userService.getSortedUsersByKey({ key: newKey })
      )
    }
  }

  const searchByText = newValue => {
    changeSearchText(newValue)

    if (newValue === '') {
      changeUsers(userService.list)
    } else {
      const newList = userService.getFilteredUsersByText(newValue)
  
      changeUsers(newList)
    }
  }

  const updateUser = updatedUser => {
    userService.editUser(updatedUser)
    changeUsers(userService.list)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <>
      <MainHeaderComponent />

      <MainComponent>
        <UserListComponent
          id='user-list-component'
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          isLoaded={isLoaded}
          list={users}
          sortKey={sortKey}
          searchText={searchText}
          loadMore={loadMoreUsers}
          sortByKey={sortUsersByKey}
          searchByText={searchByText}
          updateUser={updateUser}
        />
      </MainComponent>
    </>
  )
}

export default App
