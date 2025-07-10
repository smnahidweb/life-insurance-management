import { createBrowserRouter} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AllPolicies from "../Pages/AllPolicies/AllPolicies";
import Agents from "../Pages/Agent/Agents";
import FAQ from "../Pages/FAQ/FAQ";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import DashboardLayout from "../Layout/DashboardLayout";
import Forbidden from "../Components/Forbidden";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import AdminRoute from "./AdminRoute";
import ManagePolicies from "../Pages/Dashboard/ManagePolicies/ManagePolicies";
import MyPolicies from "../Pages/Dashboard/Customer/MyPolicies";
import SubmitReviews from "../Pages/Dashboard/Customer/SubmitReviews";
import Paymentstatus from "../Pages/Dashboard/Customer/Paymentstatus";
import PaymentPage from "../Pages/Dashboard/Customer/PaymentPage";
import ClaimRequest from "../Pages/Dashboard/Customer/ClaimRequest";
import AgentRoute from "./AgentRoute";
import AssignedCustomer from "../Pages/Dashboard/Agent/AssignedCustomer";
import ManageBlogs from "../Pages/Dashboard/Agent/ManageBlogs";
import PostBlogs from "../Pages/Dashboard/Agent/PostBlogs";
import PoliciesDetails from "../Pages/Home/PoliciesDetails/PoliciesDetails";
import Quote from "../Pages/Home/Quote";
import ApplyForm from "../Pages/Home/ApplyForm";
import ManageApplication from "../Pages/Dashboard/Admin/ManageApplication";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import ToBeAgentForm from "../Pages/ToBeAgent/ToBeagent";
import ManageAgent from "../Pages/Dashboard/Agent/ManageAgent";

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
    },
    {
        path:'/forbidden',
        Component:Forbidden
    },
    
      {
          path:"/policies/:id",
          element:
            <PoliciesDetails></PoliciesDetails>,
    },{
      path:'/quote/:id',
      element:<PrivateRoute>
        <Quote></Quote>
      </PrivateRoute>
    },
    {
      path:'/to-be-agent',
      element:<PrivateRoute>
        <ToBeAgentForm></ToBeAgentForm>
      </PrivateRoute>

    },
    {
  path: "/apply/:quoteId",
  element: (
    <PrivateRoute>
      <ApplyForm />
    </PrivateRoute>
  )
}

    
   ]
  },
  {
    path:'/',
    Component:AuthLayout,
    children:[

        {
            path:'/login',
            Component:Login
        },
        {
            path:'/register',
            Component:Register
        },
        

    ]

  },
  {
    path:'/dashboard',
     element: <PrivateRoute>
        <DashboardLayout></DashboardLayout>
     </PrivateRoute>  ,
    children:[
         {
        index:true,
        Component:DashboardHome
      },
      


      {
        path:'my-policies',
        Component:MyPolicies
      },
      {
        
        path:'my-reviews',
        Component:SubmitReviews

      },
      {
        path:'payment-status',
        Component:Paymentstatus
      },
      {
        path:'payments',
        Component:PaymentPage
      },
      {
        path:'claim-request',
        Component:ClaimRequest
      },


    //   Agent route start >>
    {
        path:'assigned-customers',
        element:<AgentRoute>
            <AssignedCustomer></AssignedCustomer>
        </AgentRoute>
    },
    {
        path:'manage-blogs',
        element:<AgentRoute>
            <ManageBlogs></ManageBlogs>
        </AgentRoute>
    },
    {
        path:"post-blog",
        element:<AgentRoute>
            <PostBlogs></PostBlogs>
        </AgentRoute>
    },


    //   Admin Route is start here

      {

        path:'manage-policies',
        element:<AdminRoute>
            <ManagePolicies></ManagePolicies>
        </AdminRoute>
        
      },
      {
        path:'manage-applications',
        element:<AdminRoute>
          <ManageApplication></ManageApplication>
        </AdminRoute>

      },{
        path:'manage-users',
        element:<AdminRoute>
          <ManageUsers></ManageUsers>
        </AdminRoute>
      },
      {
        path:'manage-agents',
        element:<AdminRoute>
          <ManageAgent></ManageAgent>
        </AdminRoute>
      }
    ]

  }
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
