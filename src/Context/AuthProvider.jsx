import React, { createContext, useEffect, useState } from 'react';

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import app from '../Firebase/firebase.init';
export const AuthContext = createContext(); 

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null)
    const[loading,setLoading] = useState(true)
  
  
     const CreateUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password);

    
  }




//   useEffect( ()=>{

//     const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
//         setUser(currentUser)
//         setLoading(false)

//     })
//     return ()=>{
//         unsubscribe()
//     }

//   },[] )


  const authdata = {
    CreateUser,
   
  };

  return (
    <AuthContext value={authdata}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
