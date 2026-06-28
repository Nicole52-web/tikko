import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/api';

const BookingDetails = () => {

    const {eventId} = useParams();
    const {token} = useContext(AuthContext);
    const [attendees, setAtttendees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


     useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await axios.get(
          apiUrl(`/api/v1/payments/organizer/event/${eventId}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAtttendees(res.data.attendees);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendees();
  }, [eventId, token]);

  const filteredAttendees = attendees.filter((attendee) => {
    const fullName = `${attendee.firstname} ${attendee.lastname}`.toLowerCase();

    const email = attendee.email?.toLowerCase() || "";


    const bookedDate = new Date(attendee.created_at).toLocaleDateString().toLocaleLowerCase();

    const search = searchTerm.toLocaleLowerCase();

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      bookedDate.includes(search)
    )
  })

  return (
    
  <div className="mt-6">
    <h2 className='text-center mb-4'>Attendees</h2>

    <div className="p-4 mb-6">
        <label className="block text-gray-700 font-medium mb-2">Search Attendees: </label>
        <input placeholder="Search attendees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border rounded-2 p-2 ml-2">
        
        </input>
    </div>

    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className='border px-4 py-2'>Name</th>
          <th className='border px-4 py-2'>Email</th>
          <th className='border px-4 py-2'>Amount Paid</th>
          <th className='border px-4 py-2'>Receipt</th>
          <th className='border px-4 py-2'>Date Booked</th>
          <th className='border px-4 py-2'>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredAttendees.map((a, i) => (
          <tr key={i}>
            <td className='border px-4 py-2'>{a.firstname} {a.lastname}</td>
            <td className='border px-4 py-2'>{a.email}</td>
            <td className='border px-4 py-2'>{a.amount}</td>
            <td className='border px-4 py-2'>{a.mpesareceiptnumber}</td>
            <td className='border px-4 py-2'>{new Date(a.created_at).toLocaleString()}</td>
            <td className='border px-4 py-2'>
              <button className='bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded'>
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


  )
}

export default BookingDetails