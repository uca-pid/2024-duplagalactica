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

export default function TemporaryDrawer({value, email=null}) {
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
      
        navigate('/login');
    };
    const goToClassCreation = () => {
      if (email!=null) {
        navigate(`/class-creation?mail=${email}`); 
      } else {
        navigate(`/class-creation`); 
      }
    };
    const goToManageRoutines = () => {
      if (email!=null) {
        navigate(`/managing-routines?mail=${email}`); 
      } else {
        navigate(`/managing-routines`); 
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
        }
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Profile', 'Create class', 'Manage routines', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={()=>navigateTo(index)}>
              <ListItemIcon>
                {index === 0 && <HomeIcon/> }
                {index === 1 && <PersonIcon/> }
                {index === 2 && <AddIcon/> }
                {index === 3 && <HomeIcon/>}
                {index === 4 && <ExitToApp/>}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Home', 'Profile', 'Booked classes', 'My routines', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='leftBar'>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
