import { useLocation, useNavigate } from 'react-router-dom'

function BackButton({ fallback = '/' }) {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <button className="back-button" type="button" onClick={() => {
      if (location.key !== 'default') navigate(-1)
      else navigate(fallback)
    }}>
      <span aria-hidden="true">←</span> Back
    </button>
  )
}

export default BackButton
