const keyLabelListDicts = [
  {key: 'fname', label: 'Имя'},
  {key: 'lname', label: 'Фамилия'},
  {key: 'email', label: 'Email'},
  {key: 'tel', label: 'Телефон'},
  {key: 'uname', label: 'Логин'},
  {key: 'registration_date', label: 'Дата регистрации'},
  {key: 'activity_date', label: 'Последняя активность'}
]

const keyLabelDetailDicts = [
  ...keyLabelListDicts,
  {key: 'country', label: 'Страна'},
  {key: 'city', label: 'Город'},
  {key: 'address', label: 'Адрес'},
  {key: 'description', label: 'Описание'},
]

const tempListId = 'fullyVisibleListElement'
const tempLoadingId = 'loadingElement'
const requiredFieldMessage = 'Это поле обязательно'

export {
  keyLabelListDicts,
  keyLabelDetailDicts,
  tempListId,
  tempLoadingId,
  requiredFieldMessage
}
