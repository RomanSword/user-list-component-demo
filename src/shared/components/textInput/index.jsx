import './styles.scss'

const TextInputComponent = ({
  id,
  type = 'text',
  label = '',
  value = '',
  placeholder = '',
  error = '',
  onChange = () => null
}) => {
  const isErrorExist = error !== ''

  return (
    <label
      className='form-control'
      data-with-label={!!label}
      htmlFor={id}
    >
      {
        !!label &&
        <span
          className='form-label'
          data-error={isErrorExist}
        >
          {label}
        </span>
      }

      <input
        id={id}
        className='form-input'
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        data-error={isErrorExist}
      />

      <div className='form-error'>{isErrorExist ? error : ''}</div>
    </label>
  )
}

export default TextInputComponent
