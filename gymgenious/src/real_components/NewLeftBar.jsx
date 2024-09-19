import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ExitToApp from '@mui/icons-material/ExitToApp'
import { useNavigate } from 'react-router-dom';

export default function TemporaryDrawer({value, email=null,type=null}) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    
    const goToMainPage = () => {
        if (value === 'add') {
            navigate('/', { state: { message: 'block' } });
        } else {
            if (email!=null) {
              navigate(`/?mail=${email}`); 
            } else {
              navigate(`/`); 
            }
            
        }
    };
    const goToLogin = () => {
      if (email==null) {
        navigate('/login');  /// X AHORA NO TE DEJA VOLVER AL LOGIN PERO SIGUE APARECIENDO EL ICONO
      } else{
        navigate(`/user-profile?mail=${email}`)  /// ESTO LO HIZO AGUS, FIJATE COMO HACES LA CONSULTA
      }
    };
    const goToClassCreation = () => {
      if (email!=null) {
        navigate(`/class-creation?mail=${email}&type=${type}`); 
      } else {
        navigate(`/class-creation`); 
      }
    };
    const goToManageRoutines = () => {
      if (email!=null) {
        navigate(`/managing-routines?mail=${email}&step=${0}&type=${type}`); 
      } else {
        navigate(`/managing-routines`); 
      }
    }
    const goToCouchClasses = () => {
      if (email!=null) {
        navigate(`/couch-classes?mail=${email}&type=${type}`); 
      } else {
        navigate(`/couch-classes`); 
      }
    }
    
    const gotToBookedClasses = () => {
      if (email!=null) {
        navigate(`/user-classes?mail=${email}&type=${type}`); 
      } else {
        navigate(`/user-classes`); 
      }
    }

    const goToMyRoutines = () => {
      if (email!=null) {
        navigate(`/user-routines?mail=${email}&type=${type}`); 
      } else {
        navigate(`/user-routines`); 
      }
    }


    const navigateTo = (index) => {
        if (index===0){
            goToMainPage();
        } else if (index===1){
            goToLogin();
        } else if (index===2){
            goToClassCreation();
        } else if (index===3){
            goToManageRoutines()
        }else if (index===4){
          goToManageRoutines()
        }else if (index===5){
          goToCouchClasses()
        }
    }

    const navigateFromUserTo = (index) => {
      if (index===0){
          goToMainPage();
      } else if (index===1){
          goToLogin();
      } else if (index===2){
          gotToBookedClasses();
      } else if (index===3){
          goToManageRoutines()
      }else if (index===4){
        goToManageRoutines()
      }else if (index===5){
        goToMyRoutines()
      }
  }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

  const DrawerList = (
    <Box sx={{ width: 250 , background:'#FEFAE0'}} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Profile', 'Create class', 'Manage routines', 'Logout','MyClasses'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={()=>navigateTo(index)}>
              <ListItemIcon>
                {index === 0 && <HomeIcon  sx={{color:'#BC6C25'}}/> }
                {index === 1 && <PersonIcon  sx={{color:'#BC6C25'}}/> }
                {index === 2 && <AddIcon  sx={{color:'#BC6C25'}}/> }
                {index === 3 && <HomeIcon  sx={{color:'#BC6C25'}}/>}
                {index === 4 && <ExitToApp  sx={{color:'#BC6C25'}}/>}
                {index === 5 && <ExitToApp  sx={{color:'#BC6C25'}}/>}
              </ListItemIcon>
              <ListItemText primary={text} primaryTypographyProps={{ sx: { color: '#BC6C25', fontWeight: 'bold' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Home', 'Profile', 'Booked classes', 'My routines', 'Logout','MyRoutines'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={()=>navigateFromUserTo(index)}>
              <ListItemIcon>
                {index === 0 && <HomeIcon sx={{color:'#BC6C25'}}/> }
                {index === 1 && <PersonIcon sx={{color:'#BC6C25'}}/> }
                {index === 2 && <AddIcon  sx={{color:'#BC6C25'}}/> }
                {index === 3 && <HomeIcon  sx={{color:'#BC6C25'}}/>}
                {index === 4 && <ExitToApp  sx={{color:'#BC6C25'}}/>}
                {index === 5 && <ExitToApp  sx={{color:'#BC6C25'}}/>}
              </ListItemIcon>
              <ListItemText primary={text} primaryTypographyProps={{ sx: { color: '#BC6C25', fontWeight: 'bold' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='leftBar'>
      <Button onClick={toggleDrawer(true)} style={{backgroundColor: '#432818',borderRadius: '50%',top:'0.5vh',left:'0.5vh ',width: '5vh', height: '5vh', minWidth: '0', minHeight: '0', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <MenuIcon sx={{color:'#FEFAE0'}}/>
      </Button>
      <Drawer open={open}  PaperProps={{sx: {backgroundColor: '#FEFAE0'}}} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
