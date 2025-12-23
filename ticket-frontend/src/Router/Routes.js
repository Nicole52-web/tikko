import { createBrowserRouter } from "react-router-dom"
import Landing from "../pages/Landing"
import SignUp from "../pages/SignUp"
import Profile from "../pages/Profile"


const router = createBrowserRouter ([
    {
        path: "dashboard",
        element: <Landing/>,
        children: [
            {
                index:true,
                element: <Profile/>
            }
        ]
    }
])