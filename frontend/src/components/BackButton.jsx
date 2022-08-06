import { FaArrowCircleLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

// NOTE: here navigate the user in the history stack for a true 'back' button

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <button className='btn btn-reverse btn-back' onClick={() => navigate(-1)}>
      <FaArrowCircleLeft /> Back
    </button>
  )
}

export default BackButton
