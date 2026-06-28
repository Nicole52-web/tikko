import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../config/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookedEvents = () => {
    const { token} = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();

  useEffect(() => {
  const fetchEvents = async () => {
    const res = await axios.get(
      apiUrl("/api/v1/payments/organizer/summary"),
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setEvents(res.data.events);
  };

  fetchEvents();
}, []);


const viewDetails = async (eventId) => {

  if (selectedEvent === eventId) {
    setSelectedEvent(null);
    setAttendees([]);
    return;
  }
  const res = await axios.get(
    apiUrl(`/api/v1/payments/organizer/event/${eventId}`),
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  setAttendees(res.data.attendees);
  setSelectedEvent(eventId);
};


const filteredEvents =  events.filter((event) => {
  const eventName = event.eventname?.toLowerCase() || ""

  const eventDay = new Date(event.date).toLocaleDateString().toLocaleLowerCase();

  const location = event.location?.toLocaleLowerCase() || ""


  return(
    eventName.includes(searchTerm) ||
    eventDay.includes(searchTerm) ||
    location.includes(searchTerm)
  )
})

  return (

    <div>
        <h1 className='text-center'>List of Booked Events</h1>


        <div className="p-4 mb-6">
        <label className="block text-gray-700 font-medium mb-2">Search Event: </label>
        <input placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border rounded-2 p-2 ml-2">
        
        </input>
    </div>

        {events.length ===0 ? (
            <p className='text-center mt-4'>No booked events found.</p>
        ): (
             <table className='w-full mt-4 border-collapse'>
        <thead>
          <tr>
            <th className='border px-4 py-2'>Event Name</th>
            <th className='border px-4 py-2'>Date</th>
            <th className='border px-4 py-2'>Location</th>
            <th className='border px-4 py-2'>Total Booked</th>
            <th className='border px-4 py-2'>Price</th>
            <th className='border px-4 py-2'>Actions</th>
            </tr>
        </thead>
      <tbody>
  {filteredEvents.map((event) => (
    <tr key={event.event_id}>
      <td className="border px-4 py-2">{event.eventname}</td>
      <td className="border px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
      <td className="border px-4 py-2">{event.location}</td>

      {/* total SUCCESS payments */}
      <td className="border px-4 py-2">
        {event.total_bookings}
      </td>
      <td className="border px-4 py-2">
        KSh {event.ticketprice}
      </td>

      <td className="border px-4 py-2">
        <button onClick={() => navigate(`/dashboard/booking-details/${event.event_id}`)} className='bg-blue-600 hover:bg-blue-700 rounded-3 py-2 px-4 text-white' >
         { selectedEvent === event.event_id ? "Close" : "View"}
        </button>
      </td>
    </tr>
  ))}
</tbody>
        
            </table>
        )}


  
       
    </div>
  )
}

export default BookedEvents