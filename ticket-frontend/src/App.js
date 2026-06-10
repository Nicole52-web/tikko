import "./App.css";
import Landing from "./pages/Landing";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Faqs from "./pages/Faqs";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Profile from "./pages/Profile";
import EventPost from "./pages/EventPost";
import EventPostSuccess from "./pages/EventPostSuccess";
import Events from "./pages/Events";
import PublicEvents from "./pages/PublicEvents";
import EventDetails from "./pages/EventDetails";
import EventEdit from "./pages/EventEdit";
import BookTicket from "./pages/BookTicket";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyTickets from "./pages/MyTickets";
import Contact from "./pages/Contact";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookedEvents from "./pages/BookedEvents";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<PublicEvents />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contact-us" element={<Contact />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="post-event" element={<EventPost />} />
          <Route path="post-event/success" element={<EventPostSuccess />} />
          <Route path="events" element={<Events />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="event/:id/edit" element={<EventEdit />} />
          <Route path="book-ticket" element={<BookTicket />} />
          <Route path="my-tickets" element={<MyTickets />} />
          <Route path="payment/success/:ticketId" element={<PaymentSuccess />} />
          <Route path="payment/:eventId" element={<Payment />} />
          <Route path="booked-events" element={<BookedEvents />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
       
        <Router>
          <AppContent />
        </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </AuthProvider>
  );
}

export default App;
