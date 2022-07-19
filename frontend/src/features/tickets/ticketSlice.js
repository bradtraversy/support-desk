import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ticketService from './ticketService'

const initialState = {
  tickets: null,
  ticket: null,
  isError: false,
  message: '',
}

// Create new ticket
export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.createTicket(ticketData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user tickets
export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTickets(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user ticket
export const getTicket = createAsyncThunk(
  'tickets/get',
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTicket(ticketId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Close ticket
export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.closeTicket(ticketId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// NOTE: removed loading, isSuccess state as it can be infered from presence or
// absence of tickets for simpler state management with no need for a reset
// function

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTickets.pending, (state) => {
        // NOTE: clear single ticket on tickets page
        state.ticket = null
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.tickets = action.payload
        state.isError = false
        state.message = ''
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.ticket = action.payload
        state.isError = false
        state.message = ''
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.isError = false
        state.message = ''
        state.ticket = action.payload
        state.tickets.map((ticket) =>
          ticket._id === action.payload._id
            ? (ticket.status = 'closed')
            : ticket
        )
      })
  },
})

export default ticketSlice.reducer
