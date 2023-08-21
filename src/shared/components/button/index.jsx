import './styles.scss'

const ButtonComponent = ({
  text = '',
  isDisabled = false,
  onClick = () => null
}) => {
  const handleOnClick = event => {
    event.preventDefault()

    onClick()
  }

  return (
    <button
      className='button button_primary'
      disabled={isDisabled}
      onClick={handleOnClick}
    >
      {text}
    </button>
  )
}

export default ButtonComponent
