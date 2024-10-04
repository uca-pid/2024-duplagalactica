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
import {jwtDecode} from "jwt-decode";
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

export default function UsserAssignment({onUsersChange}) {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [userMail,setUserMail] = useState(null);
  const [right, setRight] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningFetchingExercises, setWarningFetchingExercises] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:950px)');

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  useEffect(() => {
    onUsersChange(right); 
  }, [right, onUsersChange]);

  const correctExercisesData = async (exercisesData) => {
    let autoIncrementId=0;
    return exercisesData.map(element => {
        if (!element.series) {
            autoIncrementId++;
            return {
                id: autoIncrementId,
                name: element.name,
                series: 4,
                reps: [12, 12, 10, 10],
                timing: '60',
                description: 'aaaa',
                owner: 'Train-Mate'
            };
        }
        return element;
    });
};

  const fetchExercises = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_excersices`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios: ' + response.statusText);
      }
      const exercisesData = await response.json();

      const response2 = await fetch(`https://train-mate-api.onrender.com/api/exercise/get-all-exercises`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
      });
      const exercisesDataFromTrainMate = await response2.json();
      const totalExercises = exercisesData.concat(exercisesDataFromTrainMate.exercises)
      const totalExercisesCorrected = await correctExercisesData(totalExercises);
      console.log("ssss",userMail,totalExercisesCorrected)
      setLeft(totalExercisesCorrected);
      setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setOpenCircularProgress(false);
      setWarningFetchingExercises(true);
      setTimeout(() => {
        setWarningFetchingExercises(false);
      }, 3000);
    }
  };

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
        {items.map((exercise) => {
          const labelId = `transfer-list-item-${exercise.name}-label`;

          return (
            <ListItemButton
              key={exercise.id}
              role="listitem"
              onClick={handleToggle(exercise)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(exercise)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              {isSmallScreen ? (
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{exercise.name}</p></ListItemText>
              ) : (
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exercise.name}</p></ListItemText>
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      console.error('No token found');
    }
  }, []);
  
  useEffect(() => {
    if (userMail) {
      fetchExercises();
    }
  }, [userMail]);

  useEffect(() => {
    if(isSmallScreen) {
      if(right.length!=0){
        handleToggle(right)
      }
    }
  }, [isSmallScreen]);

  const verifyToken = async (token) => {
    setOpenCircularProgress(true);
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setOpenCircularProgress(false);
        throw error;
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: 'center', alignItems: 'center' }}
      className='grid-transfer-container'
    >
      {!isSmallScreen ? (
        <>
        {left.length===0 ? (
          <Grid item>
          <Typography sx={{ color: '#54311a', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
            There are no exercises
          </Typography>
        </Grid>
        ) : (
          <Grid className='grid-transfer-content' item>{customList(left)}</Grid>
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
      {right.length===0 ? (
        <Grid item>
        <Typography sx={{ color: '#54311a', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
          No exercises were chosen
        </Typography>
      </Grid>
      ) : (
        <Grid className='grid-transfer-content' item>{customList(right)}</Grid>
      )}
      </>
      ) : (
        <Grid className='grid-transfer-content-small-screen' item>{customList(left)}</Grid>
      )}
      {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            ) : null}
      { warningFetchingExercises ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningFetchingExercises} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error fetching exercises. Try again!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
    </Grid>
  );
}
