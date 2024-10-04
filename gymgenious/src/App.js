import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main_Page from './Components/Main_Page.jsx';
import Login from './Components/Login.jsx';
import ClassCreation from './Components/ClassCreation.jsx';
import Create_Account from './Components/Create_Account.jsx';
import Reset_Password from './Components/Reset_Password.jsx';
import New_Password from './Components/New_Password.jsx';
import Verify_email from './Components/VerifyEmail.jsx';
import Redirections from './Components/redirections.jsx';
import ManagingRoutines from './Components/ManagingRoutines.jsx';
import UserProfile from './Components/UserProfile.jsx';
import UserClasses from './Components/UserClasses.jsx';
import CouchClasses from './Components/CouchClasses.jsx';
import UserRoutines from './Components/UserRoutines.jsx';
import Logout from './Components/Logout.jsx';
import CoachRoutines from './Components/CoachRoutines.jsx';
import CoachExercises from './Components/CoachExercises.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main_Page/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/create-account" element={<Create_Account/>}/>
        <Route path="/reset-password" element={<Reset_Password/>}/>
        <Route path="/class-creation" element={<ClassCreation/>}/>
        <Route path="/new-password" element={<New_Password/>}/>
        <Route path="/verify-email" element={<Verify_email/>}/>
        <Route path="/redirections" element={<Redirections/>}/>
        <Route path="/managing-routines" element={<ManagingRoutines/>}/>
        <Route path="/user-profile" element={<UserProfile/>}/>
        <Route path="/user-classes" element={<UserClasses/>}/>
        <Route path="/couch-classes" element={<CouchClasses/>}/>
        <Route path="/user-routines" element={<UserRoutines/>}/>
        <Route path="/coach-routines" element={<CoachRoutines/>}/>
        <Route path="/coach-exercises" element={<CoachExercises/>}/>
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </Router>
  );
}
/////ESTO PUEDE SERVIR PARA EL WEB PAGE APP, NO RECARGA TODA LA PAGINA CUANDO CAMBIAS PAGINA////

// import { Link } from 'react-router-dom';

// function Navbar() {
//   return (
//     <nav>
//       <Link to="/">Home</Link>
//       <Link to="/about">About</Link>
//     </nav>
//   );
// }

export default App;
