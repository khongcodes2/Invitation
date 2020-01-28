import axios from "axios";

axios.defaults.xsrfCookieName = 'CSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
axios.defaults.withCredentials = true;

export const getEvent = (id) => (
  dispatch => {
    dispatch({type: 'LOADING_EVENT'});
    axios.get(`http://localhost:3001/events/${id}`)
    .then(response => {
      console.log(response)
      if (response.data.event) {
        dispatch({type: 'GET_EVENT', payload: {
          event: response.data.event,
          authorize:response.data.authorize
        }})
      } else {
        dispatch({type: 'EVENT_ERROR', payload: response.statusText})
      }
    })
    .catch(() => dispatch({type: 'EVENT_ERROR', payload:'event not found'}))
  }
)

export const addEvent = (event, pushHistory) => (
  dispatch => {
    axios.post('http://localhost:3001/events', {event: event})
    .then(response => {
      if (response.data.event) {
        dispatch({type: 'ADD_EVENT', payload: {
          event: response.data.event,
          authorize: response.data.authorize
        }})
      } else {
        dispatch({type: 'EVENT_ERROR', payload: response.data.errors})
      }
      return response.data.event
    })
    .then(event => {
      pushHistory(event)
    })
    .catch(() => dispatch({type: 'EVENT_ERROR', payload:'failed to create event'}))
  }
)

export const clearEvent = () => (
  dispatch => {
    dispatch({type:'CLEAR_EVENT'})
  }
)

export const editEvent = (id, loadEvent) => (
  dispatch => {
    dispatch({type:'LOADING_EVENT'});
    axios.get(`http://localhost:3001/events/${id}/edit`)
    .then(response => {
      dispatch({type: 'GET_EVENT', payload: {
        event: response.data.event,
        authorize:response.data.authorize
      }})
      return response.data.event
    })
    .then(({title, description, location, time, date}) => 
      loadEvent({title, description, location, time, date})
    )
    .catch(error => {
      if (error.message.endsWith('404')) {
        dispatch({type: 'EVENT_ERROR', payload: 'Event not found'})
      } else {
        dispatch({type: 'EVENT_ERROR', payload: 'User is not authorized to edit this resource'})
      }
    })
  }
)

export const updateEvent = () => (
  dispatch => {
    dispatch({type:'UPDATE_EVENT'})
  }
)