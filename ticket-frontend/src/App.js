import './App.css';
import Landing from './pages/Landing';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Faqs from './pages/Faqs';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import Profile from './pages/Profile';
import EventPost from './pages/EventPost';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails'

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/faqs' element={<Faqs/>} />

        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile/>}/>
          <Route 
          path='post-event'
          element ={<EventPost/>}
          />
          <Route 
          path='events'
          element ={<Events/>}
          />
          <Route 
          path='event/:id'
          element ={<EventDetails/>}
          />
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
    </AuthProvider>
  );
}

export default App;
