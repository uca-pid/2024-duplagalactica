import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import Loader from '../real_components/loader.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

export default function UserAssignment({ onUsersChange, routine,routineDay }) {
  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningFetchingUsers, setWarningFetchingUsers] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:950px)');
  
  useEffect(() => {
    onUsersChange(selectedUsers); 
  }, [selectedUsers, onUsersChange]);

  const fetchUsers = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const assignedResponse = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_assigned_routines`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!assignedResponse.ok) {
        throw new Error('Error al obtener las rutinas asignadas: ' + assignedResponse.statusText);
      }
      const assignedUsersData = await assignedResponse.json();
      const assignedUsersData2 = assignedUsersData.filter(routi => routi.id==routine && routi.day==routineDay)
      const assignedUsers = assignedUsersData2.flatMap(routine => 
        routine.users.map(user => user)
      );
      const allUsersResponse = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_users`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!allUsersResponse.ok) {
        throw new Error('Error al obtener los usuarios: ' + allUsersResponse.statusText);
      }
      const allUsers = await allUsersResponse.json();
      const filteredRows = allUsers.filter(user => user.type=='client');
      const filteredRowsRight = allUsers.filter(user => assignedUsers.includes(user.Mail));
      setUsers(filteredRows);
      setSelectedUsers(filteredRowsRight);
      setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setOpenCircularProgress(false);
      setWarningFetchingUsers(true);
      setTimeout(() => {
        setWarningFetchingUsers(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (routine && routineDay) {
      fetchUsers();
    } else {
      setUsers([]);
      setSelectedUsers([]);
    }
  }, [routine,routineDay]);

  const handleAddUser = (user) => {
      setSelectedUsers([...selectedUsers, user]);
  };

  const handleDeleteUser = (user) => {
    const updatedSelectedUsers = selectedUsers.filter(stateUser => stateUser.Mail !== user.Mail);
    setSelectedUsers(updatedSelectedUsers);
  }

  const customList = (items) => (
    <div className='transfer-list'>
      <List dense component="div" role="list">
        {items.map((user) => {
          const labelId = `transfer-list-item-${user.Mail}-label`;
          return (
            <>
            { (selectedUsers?.some(stateUser => stateUser.Mail === user.Mail)) ? (
              <ListItemButton
              sx={{backgroundColor:'#091057'}}
              key={user.Mail}
              role="listitem"
              onClick={() => handleDeleteUser(user)}
            >
              <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', color: 'white' }}>{user.Mail}</p></ListItemText>
              <DeleteIcon sx={{color:'white'}}/>
            </ListItemButton>
            ) : (
              <ListItemButton
              key={user.Mail}
              role="listitem"
              onClick={() => handleAddUser(user)}
            >
              <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{user.Mail}</p></ListItemText>
              <AddCircleOutlineSharpIcon/>
            </ListItemButton>
            )}
            </>
          );
        })}
      </List>
    </div>
  );

  return (
    <div className="'grid-transfer-container" style={{display:'flex', justifyContent: 'space-between'}}>
        {!(routine && routineDay) ? (
          <Grid item>
            <Typography sx={{ color: '#424242', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
              Select a routine and a day to assign
            </Typography>
          </Grid>
        ) : (
          <>
            {users.length===0 ? (
              <Grid item>
              <Typography sx={{ color: '#424242', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
                There are no users
              </Typography>
            </Grid>
            ) : (
              <div className="input-small-container">
              <Grid className='grid-transfer-content-users' item>{customList(users)}</Grid>
              </div>
            )}
          </>
        )}
      {openCircularProgress ? (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={openCircularProgress}
        >
          <Loader></Loader>
        </Backdrop>
      ) : null}
      {warningFetchingUsers ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningFetchingUsers} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                  Error fetching users. Try again!
                </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      ) : null}
    </div>
  );
}
