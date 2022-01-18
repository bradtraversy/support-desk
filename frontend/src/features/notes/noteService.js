import axios from 'axios'

const API_URL = '/api/tickets/'

// Get ticket notes
const getNotes = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + ticketId + '/notes', config)

  return response.data
}

const noteService = {
  getNotes,
}

export default noteService
