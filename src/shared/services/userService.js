import apiRequestHelper from '../helpers/apiRequestHelper'
import formatDateString from '../helpers/formatDateString'

import { isDigit, mayBeDate } from '../helpers/validators'

const getUsers = {
  host: `${import.meta.env.VITE_DOMAIN}/?`,
  rowsCount: 15,
  maxPages: 5,
  params: {
    id: 'index',
    fname: 'firstName',
    lname: 'lastName',
    tel: 'phone',
    address: 'streetAddress',
    city: 'city',
    country: 'country',
    pretty: true,
    registration_date: 'date%7C10-10-2020,01-01-2023',
    activity_date: 'date%7C10-10-2020,01-01-2023',
    uname: 'username',
    email: 'email',
    description: 'lorem'
  }
}

let getUsersUrl = `${getUsers.host}rows=${getUsers.rowsCount}`

getUsersUrl = Object.keys(getUsers.params).reduce((result, key) => {
  return result + `&${key}={${getUsers.params[key]}}`
}, getUsersUrl)

const userService = {
  list: [],

  saveUsers(newValue) {
    this.list = [...newValue]
  },

  async getUsers({ page = 0 }) {
    if (page >= getUsers.maxPages) {
      return []
    }

    let response = await apiRequestHelper({
      url: getUsersUrl
    })

    return response.map(item => ({
      ...item,
      registration_date: formatDateString(item.registration_date),
      activity_date: formatDateString(item.activity_date),
    }))
  },

  getSortedUsersByKey({ key = null }) {
    return [...this.list].sort((itemA, itemB) => {
      const valueA = String(itemA[key]).toLowerCase()
      const valueB = String(itemB[key]).toLowerCase()

      if (valueA > valueB) {
        return 1
      }

      if (valueA < valueB) {
        return -1
      }

      return 0
    })
  },

  getFilteredUsersByText(value) {
    const processedValue = value.toLowerCase()

    let keys = ['fname', 'lname', 'uname', 'email']

    if (isDigit(processedValue)) {
      keys = ['tel']
    } else if (mayBeDate(processedValue)) {
      keys = ['registration_date', 'activity_date']
    }

    return this.list.filter(item => {
      let conditions = []

      keys.forEach(key => {
        conditions.push(item[key].toLowerCase().includes(processedValue))
      })

      return conditions.some(item => item)
    })
  },

  editUser(updatedUser) {
    this.list = this.list.map(item => {
      if (item.id === updatedUser.id) {
        item = { ...updatedUser }
      }

      return item
    })
  }
}

export default userService