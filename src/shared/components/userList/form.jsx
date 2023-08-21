import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import TextInputComponent from '../textInput'
import ButtonComponent from '../button'

import { keyLabelDetailDicts, requiredFieldMessage } from './constants'
import './styles.scss'

export default class UserFormComponent extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    let state = {}

    keyLabelDetailDicts.forEach(item => {
      if (props.form[item.key]) {
        state[item.key] = props.form[item.key]
        state[`${item.key}_error`] = ''
      }
    })

    this.state = state
  }

  onChange = (key, value) => {
    this.setState({
      [key]: value,
      [`${key}_error`]: ''
    })
  }

  // Перед отправкой изменений вверх - валидируем форму
  // Если есть хотя бы одна ошибка, отправки не будет
  onSubmit = () => {
    let errors = {}

    keyLabelDetailDicts.forEach(item => {
      errors[`${item.key}_error`] = this.state[item.key] ? '' : requiredFieldMessage
    })

    this.setState({ ...errors })

    const isNoError = Object.keys(errors).every(key => errors[key] === '')

    if (isNoError) {
      let updatedForm = {
        id: this.props.form.id
      }

      keyLabelDetailDicts.forEach(item => {
        updatedForm[item.key] = this.state[item.key]
      })

      this.props.onSubmit(updatedForm)
    }
  }

  render() {
    return (
      <div className='user-form'>
        {keyLabelDetailDicts.map(item => {
          const id = `FormTextInput_${item.key}`

          return (
            <TextInputComponent
              id={id}
              key={id}
              label={item.label}
              value={this.state[item.key]}
              error={this.state[`${item.key}_error`]}
              onChange={value => this.onChange(item.key, value)}
            />
          )
        })}

        <div className='user-list-submit-panel'>
          <ButtonComponent
            text='Сохранить'
            onClick={this.onSubmit}
          />
        </div>
      </div>
    )
  }
}
