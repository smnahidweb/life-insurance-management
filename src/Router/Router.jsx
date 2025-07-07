import { createBrowserRouter} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AllPolicies from "../Pages/AllPolicies/AllPolicies";
import Agents from "../Pages/Agent/Agents";
import FAQ from "../Pages/FAQ/FAQ";

 export const router = createBrowserRouter([
  {
  path: "/",
   Component:RootLayout,
   children:[
    {
        index:true,
        Component:Home,
        
    },
    {
        path:'/policies',
        Component:AllPolicies
    },
    {
        path:'/agents',
        Component:Agents

    },
    {
        path:'/faq',
        Component:FAQ
    }
    
   ]
  },
//   auth layout route started
//   {
//     path:'/',
//     Component:AuthLayout,
//     children:[
//       {
//         path:'/login',
//         Component:Login
//       },{
//         path:'/register',
//         Component:Register
//       }
//     ]
//   },
// Dashboard layout is started
//   {
//     path:'/dashboard',
//     element:<PrivateRoute>
//       <Dashboard></Dashboard>
//     </PrivateRoute>,
//     children:[
//       {
//         index:true,
//         Component:DashBoardHome
//       },
//       {
//         path:'myParcels',
//         Component:MyParcel
//       },
//       {
//         path:'payment/:parcelId',
//         Component:Payment
//       },
//       {
//         path:'paymentHistory',
//         Component:PaymentHistory
//       },



//       // riders routes
//       {
//         path:'pending-tasks',
//         element:<RiderRoute>
//           <PendingTask></PendingTask>
//         </RiderRoute>

//       },
//       {
//         path:'delivered-task',
//         element:<RiderRoute>
//           <Deliveredtask></Deliveredtask>
//         </RiderRoute>
//       },
//       {
//         path:'myEarning',
//         element:<RiderRoute>
//           <MyEarning></MyEarning>
//         </RiderRoute>

//       },


//       {
//         path:'pendingRiders',
//         element: <AdminRoute>
//           <PendingRiders></PendingRiders>
//         </AdminRoute>
//       }
//       ,{
//         path:'activeRiders',
//        element:<AdminRoute>
//         <ActiveRiders></ActiveRiders>
//        </AdminRoute>

//       },
//       {
//         path:"makeAdmin",
//         element:<AdminRoute>
//           <MakeAdmin></MakeAdmin>
//         </AdminRoute>
//       },{
//         path:'assign-rider',
//         element:<AdminRoute>
//           <AssignParcel></AssignParcel>
//         </AdminRoute>
//       }

//     ]
//   }
])
