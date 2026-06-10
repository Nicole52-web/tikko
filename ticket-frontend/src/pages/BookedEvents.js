import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../config/api';
import axios from 'axios';

const BookedEvents = () => {
    const { token} = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

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
  const res = await axios.get(
    apiUrl(`/api/v1/payments/organizer/event/${eventId}`),
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  setAttendees(res.data.attendees);
  setSelectedEvent(eventId);
};

  return (

    <div>
        <h1 className='text-center'>List of Booked Events</h1>

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
  {events.map((event) => (
    <tr key={event.event_id}>
      <td className="border px-4 py-2">{event.eventname}</td>
      <td className="border px-4 py-2">{event.date}</td>
      <td className="border px-4 py-2">{event.location}</td>

      {/* total SUCCESS payments */}
      <td className="border px-4 py-2">
        {event.total_bookings}
      </td>
      <td className="border px-4 py-2">
        KSh {event.ticketprice}
      </td>

      <td className="border px-4 py-2">
        <button onClick={() => viewDetails(event.event_id)} className='bg-blue-600 hover:bg-blue-700 rounded-3 py-2 px-4 text-white' >
          View
        </button>
      </td>
    </tr>
  ))}
</tbody>
        
            </table>
        )}


        {selectedEvent && (
  <div className="mt-6">
    <h2>Attendees</h2>

    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className='border px-4 py-2'>Name</th>
          <th className='border px-4 py-2'>Email</th>
          <th className='border px-4 py-2'>Amount Paid</th>
          <th className='border px-4 py-2'>Receipt</th>
        </tr>
      </thead>

      <tbody>
        {attendees.map((a, i) => (
          <tr key={i}>
            <td className='border px-4 py-2'>{a.firstname} {a.lastname}</td>
            <td className='border px-4 py-2'>{a.email}</td>
            <td className='border px-4 py-2'>{a.amount}</td>
            <td className='border px-4 py-2'>{a.mpesareceiptnumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

       
    </div>
  )
}

export default BookedEvents