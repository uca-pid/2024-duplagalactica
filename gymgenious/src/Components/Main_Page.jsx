import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import NewLeftBar from '../real_components/NewLeftBar.jsx';
import {jwtDecode} from "jwt-decode";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CheckIcon from '@mui/icons-material/Check';
import Calendar from '../real_components/Calendar.jsx';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import EnhancedTable from '../real_components/TableClasses.jsx';
import WarningConnectionAlert from '../real_components/WarningConnectionAlert.jsx';
import ErrorTokenAlert from '../real_components/ErrorTokenAlert.jsx';
import SuccessAlert from '../real_components/SuccessAlert.jsx';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Loader from '../real_components/loader.jsx'

    




export default function Main_Page() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [leftBarOption, setLeftBarOption] = useState('');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [userMail,setUserMail] = useState(null);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [successBook,setSuccessBook] = useState(false);
  const [successUnbook,setSuccessUnbook] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:250px)');
  const [type, setType] = useState(null);


  
  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  }

  function ECommerce({event}) {
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseModal}>
          <MDBContainer>
            <MDBRow className="justify-content-center">
              <MDBCol md="9" lg="7" xl="5" className="mt-5">
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black">
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>{event.name}</MDBTypography>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <p className="small mb-0" style={{color: '#424242' }}><AccessAlarmsIcon sx={{ color: '#48CFCB'}} />{event.dateInicio.split('T')[1].split(':').slice(0, 2).join(':')} - {event.dateFin.split('T')[1].split(':').slice(0, 2).join(':')}</p>
                        <p className="fw-bold mb-0" style={{color: '#424242' }}>{formatDate(new Date(event.dateInicio))}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-4">
                      <div className="flex-shrink-0">
                        <MDBCardImage
                          style={{ width: '70px' }}
                          className="img-fluid rounded-circle border border-dark border-3"
                          src={event.sala=='cuyAhMJE8Mz31eL12aPO' ? `${process.env.PUBLIC_URL}/gimnasio.jpeg` : (event.sala=='PmQ2RZJpDXjBetqThVna' ? `${process.env.PUBLIC_URL}/salon_pequenio.jpeg` : (event.sala=='jxYcsGUYhW6pVnYmjK8H' ? `${process.env.PUBLIC_URL}/salon_de_functional.jpeg` : `${process.env.PUBLIC_URL}/salon_de_gimnasio.jpg`)) }
                          alt='Generic placeholder image'
                          fluid />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex flex-row align-items-center mb-2">
                          <p className="mb-0 me-2" style={{color: '#424242' }}>{selectedEvent.salaInfo.nombre}</p>
                        </div>
                        <div>
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1"  style={{color: '#424242' }}>Capacity {event.capacity}</MDBBtn>
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>{event.permanent==='Si' ? 'Every week' : 'Just this day'}</MDBBtn>
                          <MDBBtn outline color="dark" floating size="sm" style={{color: '#424242' }}><MDBIcon fas icon="comment" /></MDBBtn>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <MDBCardText><CollectionsBookmarkIcon sx={{ color: '#48CFCB'}} /> {event.BookedUsers.length} booked users</MDBCardText>
                    <MDBCardText><EmailIcon sx={{ color: '#48CFCB'}} /> For any doubt ask "{event.owner}"</MDBCardText>
                    {userMail && type==='client' && (new Date(selectedEvent.start).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000) &&
                      (new Date(selectedEvent.start).getTime() >= new Date().setHours(0, 0, 0, 0))
                      ? (
                        <>
                        {selectedEvent.BookedUsers && selectedEvent.BookedUsers.includes(userMail)  ? (
                              <MDBBtn
                              style={{ backgroundColor: '#48CFCB', color: 'white' }} 
                              rounded
                              block
                              size="lg"
                              onClick={() => handleUnbookClass(event.id)}
                            >
                              Unbook
                            </MDBBtn>
                            ) : (
                              <>
                              {selectedEvent.BookedUsers.length<selectedEvent.capacity ? (
                              <MDBBtn
                                style={{ backgroundColor: '#48CFCB', color: 'white' }} 
                                rounded
                                block
                                size="lg"
                                onClick={() => handleBookClass(event.id)}
                              >
                                Book now
                              </MDBBtn>
                              ) :
                              (<>
                              <MDBBtn
                                style={{ backgroundColor: '#48CFCB', color: 'white' }} 
                                rounded
                                block
                                size="lg"
                              >
                                FULL
                              </MDBBtn>
                              </>)
                              }
                              </>
                        )}
                        <button 
                          onClick={handleCloseModal}
                          className="custom-button-go-back-managing"
                          style={{
                            zIndex: '2',
                            position: 'absolute', 
                            top: '0px',
                            right: '10px', 
                          }}
                        >
                          <CloseIcon sx={{ color: '#F5F5F5' }} />
                        </button>
                        </>
                        ) : (
                          <button 
                            onClick={handleCloseModal}
                            className="custom-button-go-back-managing"
                            style={{
                              zIndex: '2',
                              position: 'absolute', 
                              top: '0px',
                              right: '10px', 
                            }}
                          >
                            <CloseIcon sx={{ color: '#F5F5F5' }} />
                          </button>
                        )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </div>
    );
  }

  const changeShowCalendar = () => {
    setShowCalendar(prevState => !prevState);
    handleCloseModal()
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      
      const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_salas');
      if (!response2.ok) {
        throw new Error('Error al obtener las salas: ' + response2.statusText);
      }
      const salas = await response2.json();
  
      const dataWithSala = data.map(clase => {
        const salaInfo = salas.find(sala => sala.id === clase.sala);
        return {
          ...clase,
          salaInfo, 
        };
      });
  
      const calendarEvents = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      dataWithSala.forEach(clase => {
        const startDate = new Date(clase.dateInicio);
        const CorrectStarDate = new Date(startDate.getTime() + 60 * 3 * 60 * 1000);
        const endDate = new Date(clase.dateFin);
        const CorrectEndDate = new Date(endDate.getTime() + 60 * 3 * 60 * 1000);
  
        if (clase.permanent === "Si") {
          let nextStartDate = new Date(CorrectStarDate);
          let nextEndDate = new Date(CorrectEndDate);
  
          if (nextStartDate < today) {
            const dayOfWeek = CorrectStarDate.getDay();
            let daysUntilNextClass = (dayOfWeek - today.getDay() + 7) % 7;
            if (daysUntilNextClass === 0 && today > CorrectStarDate) {
              daysUntilNextClass = 7;
            }
            nextStartDate.setDate(today.getDate() + daysUntilNextClass);
            nextEndDate = new Date(nextStartDate.getTime() + (CorrectEndDate.getTime() - CorrectStarDate.getTime()));
          }
  
          for (let i = 0; i < 4; i++) {
            calendarEvents.push({
              title: clase.name,
              start: new Date(nextStartDate),
              end: new Date(nextEndDate),
              allDay: false,
              ...clase,
            });
            nextStartDate.setDate(nextStartDate.getDate() + 7);
            nextEndDate.setDate(nextEndDate.getDate() + 7);
          }
        } else {
          calendarEvents.push({
            title: clase.name,
            start: new Date(CorrectStarDate),
            end: new Date(CorrectEndDate),
            allDay: false,
            ...clase,
          });
        }
      });
      setTimeout(() => {
        setOpenCircularProgress(false);
      }, 3000);
      setEvents(calendarEvents);
      setClasses(dataWithSala)
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };
  

  const handleBookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/book_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
      setSuccessBook(true)
      setTimeout(() => {
        setSuccessBook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
    
  };

  const handleUnbookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/unbook_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
      setSuccessUnbook(true);
      setTimeout(() => {
        setSuccessUnbook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setTimeout(() => {
        setOpenCircularProgress(false);
      }, 3000);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };

  const verifyToken = async (token) => {
    setOpenCircularProgress(true);
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setOpenCircularProgress(false);
        setErrorToken(true);
        setTimeout(() => {
          setErrorToken(false);
        }, 3000);
        throw error;
    }
  };

  useEffect(() => {
    let token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
    fetchClasses();
  }, []);

  useEffect(() => {
    if (userMail) {
      fetchUser();
    }
  }, [userMail, showCalendar]);

  const fetchUser = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        setType(data.type);
        setTimeout(() => {
          setOpenCircularProgress(false);
        }, 3000);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };
  
  return (
    <div className="App">
      {circularProgressClasses ? (<><loader></loader></>):(<></>)}
      <SuccessAlert successAlert={successBook} message={'Successfully Booked!'}/>
      <SuccessAlert successAlert={successUnbook} message={'Successfully Unbooked!'}/>
      <WarningConnectionAlert warningConnection={warningConnection}/>
      <ErrorTokenAlert errorToken={errorToken}/>
      <NewLeftBar/>
      {openCircularProgress ? (
              <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={openCircularProgress}
            >
              <Loader></Loader>
          </Backdrop>
      ) : null}

      {!isSmallScreen ? (
      <>
        <div className="Calendar-Button">
          {showCalendar ? (
            <button onClick={changeShowCalendar} className="Toggle-Button">
              Show table
            </button>
          ) : (
            <button onClick={changeShowCalendar} className="Toggle-Button">
              Show calendar
            </button>
          )}
        </div>
        {showCalendar ? (
        <div className="WebApp-Body">
          <Calendar events={events} onSelectEvent={handleSelectEvent} />
        </div>
        ) : (
        <div className="Table-Container">
          <EnhancedTable rows={classes} user={userMail} userType={type} handleBookClass={handleBookClass} handleUnbookClass={handleUnbookClass} handleSelectEvent={handleSelectEvent}/>
        </div>
      )}
      </>
  ) : (
    <div className="Table-Container">
          <EnhancedTable rows={classes} user={userMail} userType={type} handleBookClass={handleBookClass} handleUnbookClass={handleUnbookClass} handleSelectEvent={handleSelectEvent}/>
    </div>
  )}
  {selectedEvent && (
    <ECommerce event={selectedEvent}/>
  )}
    </div>
  );
}
