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

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

export default function UserAssignment({ onUsersChange, routine }) {
  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningFetchingUsers, setWarningFetchingUsers] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:950px)');

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  
  useEffect(() => {
    onUsersChange(right); 
  }, [right, onUsersChange]);

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
      const assignedUsersData2 = assignedUsersData.filter(routi => routi.id==routine)
      console.log("2",assignedUsersData2)
      const assignedUsers = assignedUsersData2.flatMap(routine => 
        routine.user.map(user => user.Mail)
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
      const filteredRows = allUsers.filter(user => !assignedUsers.includes(user.Mail));
      console.log("4",filteredRows)
      const filteredRowsRight = allUsers.filter(user => assignedUsers.includes(user.Mail));
      console.log("5",filteredRowsRight)
      setUsers(filteredRows);
      setLeft(filteredRows);
      setRight(filteredRowsRight)
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
    if (routine) {
      fetchUsers();
    } else {
      setLeft([]);
      setRight([]);
    }
  }, [routine]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    const newRight = right.concat(left);
    setRight(newRight);
    setLeft([]);
    onUsersChange(newRight);
  };

  const handleCheckedRight = () => {
    const newRight = right.concat(leftChecked);
    setRight(newRight);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    onUsersChange(newRight);
  };

  const handleCheckedLeft = () => {
    const newLeft = left.concat(rightChecked);
    setLeft(newLeft);
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    onUsersChange(newLeft); 
  };

  const handleAllLeft = () => {
    const newLeft = left.concat(right);
    setLeft(newLeft);
    setRight([]);
    onUsersChange(newLeft); 
  };

  const customList = (items) => (
    <Paper className='transfer-list'>
      <List dense component="div" role="list">
        {items.map((user) => {
          const labelId = `transfer-list-item-${user.Mail}-label`;

          return (
            <ListItemButton
              key={user.Mail}
              role="listitem"
              onClick={handleToggle(user)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(user)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              {isSmallScreen ? (
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{user.Mail}</p></ListItemText>
              ) : (
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.Mail}</p></ListItemText>
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: 'center', alignItems: 'center', maxWidth: '100%' }}
      className='grid-transfer-container'
    >
      {!isSmallScreen ? (
        <>
        {!routine ? (
          <Grid item>
            <Typography sx={{ color: '#54311a', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
              Select a routine to assign
            </Typography>
          </Grid>
        ) : (
          <>
            {left.length===0 ? (
              <Grid item>
              <Typography sx={{ color: '#54311a', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
                There are no users
              </Typography>
            </Grid>
            ) : (
              <Grid className='grid-transfer-content' item>{customList(left)}</Grid>
            )}
          </>
        )}
        <Grid item>
          <Grid container direction="column" sx={{ alignItems: 'center' }}>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        {right.length === 0 ? (
          <Grid item>
            <Typography sx={{ color: '#54311a', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
              No users were chosen
            </Typography>
          </Grid>
        ) : (
          <Grid className='grid-transfer-content' item>{customList(right)}</Grid>
        )}
        </>
      ) : (
        <Grid sx={{width:'90%', marginRight:'5%'}} className='grid-transfer-content-small-screen' item>{customList(left)}</Grid>
      )}
      {openCircularProgress ? (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={openCircularProgress}
        >
          <CircularProgress color="inherit" />
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
    </Grid>
  );
}
