import React, {useState, useEffect, useRef, useCallback} from 'react';
import outsideKid from '../assets/character/outside.svg';
import sunburnKid from '../assets/character/sunburnt.svg';
import indoorsKid from '../assets/character/inside.svg';
import {useParams} from 'react-router-dom';
import {accurateInterval} from '../utils/helpers.js';
import Copyright from '../components/Copyright';
import Character from '../components/Character';
import LinearProgressWithLabel from '../components/LinearProgressWithLabel';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { StaticBanner } from 'material-ui-banner';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF9800', // Orange
    },
    secondary: {
      main: '#009688', // Teal
    },
  },
  font: {
	family: ''
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#ff9800',
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(3),
    margin: '2rem auto',
    maxWidth: '800px',
    width: '90%',
    backgroundColor: '#f2f4f5', // Updated this line
    borderRadius: '12px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
  },
  avatarLarge: {
  	width: 72,
    height: 72,
  },
  buttonWrapper: {
    position: 'relative',
    // display: 'inline-flex',
    // alignItems: 'center',
  },
  button: {
    position: 'relative',
    overflow: 'hidden', // Ensure child elements don't overflow
  },
  circularProgress: {
    position: 'absolute',
    top: '30%',
    left: '45%',
    transform: 'translate(-50%, -50%)',
    // color: 'yell', // Optional: Change color if needed
  },
  uvProgress: {
    position: 'relative',
    display: 'inline-flex',
    marginLeft: theme.spacing(1),
  },
  uvProgressLabel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  characterContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  statLabel: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  uvIndex: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  uvValue: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
  },
}));

//Helper functions
 
 function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else if (response.status === 429){
    return Promise.resolve(response)
  }else {
    return Promise.reject(new Error(response.statusText))
  }
 }

 function json(response) {
  return response.json()
 }

 const stayInRange = (stat) => {
  	if (stat >= 0 && stat <= 100)
	    return stat;
	 else if (stat > 100)
	    return 100;
	else
	    return 0;
  }




export default function App() {

const [name, setName] = useState('Pippin');
const [dayDuration, setDayDuration] = useState(1000); //in miliseconds
const [age, setAge] = useState(0);



// const [health, setHealth] = useState(100);
// const [hunger, setHunger] = useState(0);
// const [happiness, setHappiness] = useState(100);

const [sunburn, setSunburn] = useState(0);
const [boredom, setBoredom] = useState(0);
const [outdoor, setOutdoor] = useState(true);
const [sunscreen, setSunscreen] = useState(false);
const [money, setMoney] = useState(0);
const [hat, setHat] = useState(false);
const [uv, setUv] = useState(5);
const [sunscreenDuration, setSunscreenDuration] = useState(0);

const [gameEnd, setGameEnd] = useState(false);
const [dialogOpen, setDialogOpen] = useState(false);
const timeoutRef = useRef();
const eventTimeoutRef = useRef();
const classes = useStyles();
const {petName, dayDurationInSeconds} = useParams();

const outdoorRef = useRef(outdoor);
const sunscreenRef = useRef(sunscreen);
const uvRef = useRef(uv);
const [uvChangeProgress, setUvChangeProgress] = useState(0);




 const beginLife = () => {
    let timeOutInfo = accurateInterval(() => {
          petDay();
        }, dayDuration) 
    timeoutRef.current = timeOutInfo;
    //console.log(timeoutRef.current)
 }

//   const handleNextEvent = (nextEvent) => {
//   	/*timeoutRef.current is null when starting a new game. 
//   	This condition also keeps the app from fetching when the game has ended
//   	*/
//   	if (timeoutRef.current !== null) {
// 	  	let nextEventInfo = accurateInterval(() => {
// 	          getNextEvent();
// 	        }, nextEvent)
// 	    eventTimeoutRef.current = nextEventInfo;
//     	//console.log(eventTimeoutRef.current);
//     }
//   }

//   const getNextEvent = () => {
  	
// 		fetch('https://www.virtual-pet.uk/v1/event')
// 			.then(status)
// 			.then(json)
// 			.then(function(data) {
// 			    if(data.type === 'Error'){
// 			    	 console.log('Request failed', data);
// 			    	 if (eventTimeoutRef.current) {
// 						    eventTimeoutRef.current.cancel();
// 						    eventTimeoutRef.current = null;
// 						 }
// 			    	 handleNextEvent(data.nextEvent * dayDuration);
// 			    } else {
// 			    	console.log('Request succeeded with JSON response', data);
// 				    setHealth((prev) => stayInRange(prev + data.impact.health));
// 					setHunger((prev) => stayInRange(prev + data.impact.hunger));
// 					setHappiness((prev) => stayInRange(prev + data.impact.happiness));
// 					handleOpenBanner(data.type.toUpperCase() + "! " + data.title + ": " + data.description + " Impact, health: " + data.impact.health + " hunger: " + data.impact.hunger + " happiness: " + data.impact.happiness, getCharacter(data.type));
// 					if (eventTimeoutRef.current) {
// 						    eventTimeoutRef.current.cancel();
// 						    eventTimeoutRef.current = null;
// 						 }
// 					handleNextEvent(data.nextEvent * dayDuration); 
// 				}			    	

// 			 }).catch(function(error) {
// 			    console.log('Request failed', error);
// 			 });
		  	
//   }

 const petDay = () => {
	setAge((prevAge) => {
	  const newAge = prevAge + 1;
	  const daysUntilUvChange = (5 - (newAge % 5)) % 5;
	  if (daysUntilUvChange === 0) {
		setUv(Math.floor(Math.random() * 14) + 1);
	  }
	  setUvChangeProgress(((5 - daysUntilUvChange) / 5) * 100);
	  return newAge;
	});
  
	if (outdoorRef.current) {
	  if (sunscreenRef.current) {
		setSunscreenDuration((prevDuration) => {
		  if (prevDuration > 0) {
			return prevDuration - 1;
		  } else {
			setSunscreen(false);
			return 0;
		  }
		});
		setSunburn((prevSunburn) => stayInRange(prevSunburn + (uvRef.current / 2)));
	  } else {
		setSunburn((prevSunburn) => stayInRange(prevSunburn + uvRef.current));
	  }
	  setBoredom((prevBoredom) => stayInRange(prevBoredom - 5));
	} else {
	  setSunburn((prevSunburn) => stayInRange(prevSunburn - 10));
	  setBoredom((prevBoredom) => stayInRange(prevBoredom + 5));
	}
  };

//   const cleanPet = () => {
// 	if (!gameEnd) {
// 		setHealth((prev) => stayInRange(prev + 1));
// 	}
// }

// const feedPet = () => {
// 	if (!gameEnd) {
// 		setHunger((prev) => stayInRange(prev - 1));
// 	}
// }

// const playPet = () => {
// 	if (!gameEnd) {
// 		setHappiness((prev) => stayInRange(prev + (Math.floor(Math.random() * 5) + 1))); // random reduction between 1 -> 5)
// 	}
// }

  const goInside = () => {
	if (!gameEnd) {
		setOutdoor(false);
		setSunscreen(false);
		setSunscreenDuration(0);
	}
  }

  const goOutside = () => {
	if (!gameEnd) {
		setOutdoor(true);
	}
  }

  const applySunscreen = () => {
	if (!gameEnd) {
		if (money >= 5) {
			setMoney((prevMoney) => prevMoney - 5);
			setSunscreen(true);
			setSunscreenDuration(5);

	}
  }}

  const doChores = () => {
	if (!gameEnd) {
	  setMoney((prevMoney) => prevMoney + 1);
	  setBoredom((prevBoredom) => stayInRange(prevBoredom + 10));
	}
  };


  const resetGame = () => {  	  	
  	setAge(0);
	setSunburn(0);
	setBoredom(0);
	setSunscreen(false);
	setGameEnd(false);
	setMoney(0);
  }

  //helper functions
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleOpenBanner = useCallback((text, eventTypeGraphic) => StaticBanner.show({
  		icon: <div />,
  		iconProps : {
  			src: eventTypeGraphic,
  			className:  classes.avatarLarge
  		},
	    open:  true,
	    label: text,
   }), [classes.avatarLarge]);

  const cleanup = () => {
     //Cancel timers
		if (timeoutRef.current) {
	      timeoutRef.current.cancel();
	      
	    }
	    if (eventTimeoutRef.current) {
		  eventTimeoutRef.current.cancel();
		}

		timeoutRef.current = null;
		eventTimeoutRef.current = null;
   }
  
  //Effects


  useEffect(() => {
	outdoorRef.current = outdoor;
  }, [outdoor]);
  
  useEffect(() => {
	sunscreenRef.current = sunscreen;
  }, [sunscreen]);
  
  useEffect(() => {
	uvRef.current = uv;
  }, [uv]);

  useEffect(() => {
   if (sunburn == 100 || boredom == 100) {   	 
   	 setDialogOpen(true);
	 setGameEnd(true);
   }
  }, [sunburn, boredom]);

  useEffect(() => {
    if (!gameEnd) {
      // Set pet name if provided
      if (petName !== undefined) {
        setName(decodeURIComponent(petName));
      }

      // Set day duration
      if (dayDurationInSeconds !== undefined && !Number.isNaN(parseInt(dayDurationInSeconds))) {
        let inputedDuration = parseInt(dayDurationInSeconds);
        if (inputedDuration <= 0) {
          setDayDuration(1000);
        } else if (inputedDuration > 60) {
          setDayDuration(60 * 1000);
        } else {
          setDayDuration(inputedDuration * 1000);
        }
      } else {
        setDayDuration(1000);
      }

      // Initialize game state
      setSunburn(0);
      setBoredom(0);
      setOutdoor(true);
      setSunscreen(false);
      setSunscreenDuration(0);
      setUv(5); // Starting UV index

      // Start the game loop
      beginLife();

      // Schedule the first UV change
      const uvChangeInterval = setInterval(() => {
        setUv(Math.floor(Math.random() * 14) + 1);
      }, 5 * dayDuration);

      // Cleanup function
      return () => {
        cleanup();
        clearInterval(uvChangeInterval);
      };
    } else {
      cleanup();
    }
  }, [gameEnd, petName, dayDurationInSeconds, dayDuration]);

  const daysUntilUvChange = (5 - (age % 5)) % 5;

  const getCharacterImage = () => {
    if (outdoor) {
      if (sunburn > 50) {
        return sunburnKid;
      }
      return outsideKid;
    }
    return indoorsKid;
  };


  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <StaticBanner />
        <Grid container component="main" className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h3" gutterBottom>
                  {name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Age: {age}
                </Typography>
                <div className={classes.uvIndex}>
                  <Typography variant="body1">Today's UV Index:</Typography>
                  <Typography
                    variant="body1"
                    className={classes.uvValue}
                    style={{ color: uv > 10 ? 'red' : uv > 5 ? 'orange' : 'green' }}
                  >
                    {uv}
                  </Typography>
                  <Box position="relative" display="inline-flex" marginLeft={1}>
                    <CircularProgress variant="determinate" value={uvChangeProgress} size={24} />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="caption" component="div" color="textSecondary">
                        {daysUntilUvChange}
                      </Typography>
                    </Box>
                  </Box>
                </div>
                <Typography variant="body1" gutterBottom>
                  Coins: {money}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  You are currently {outdoor ? "outdoors" : "indoors"}
                </Typography>
                <Typography variant="body1" className={classes.statLabel}>
                  Sunburn:
                </Typography>
                <LinearProgressWithLabel value={sunburn} />
                <Typography variant="body1" className={classes.statLabel}>
                  Boredom:
                </Typography>
                <LinearProgressWithLabel value={boredom} />
                
                <ButtonGroup color="primary" variant="contained" className={classes.buttonGroup}>
                  <Button
                    disabled={gameEnd}
                    onClick={outdoor ? goInside : goOutside}
                    className={classes.button}
                  >
                    {outdoor ? 'Go Inside' : 'Play Outside'}
                  </Button>
                  {outdoor && (
                    <Tooltip title={`Spend 5 coins to reduce sunburn for 5 days`} arrow placement="top"  leaveDelay={200} style={{ fontSize: '1.2em' }}>
                      <span>
                        <Button
                          disabled={gameEnd || sunscreenDuration > 0 || money < 5}
                          onClick={applySunscreen}
                          className={classes.button}
                        >
                          Apply Sunscreen
                          {sunscreenDuration > 0 && (
                            <CircularProgress
                              variant="static"
                              value={(sunscreenDuration / 5) * 100}
                              size={24}
                              className={classes.circularProgress}
                            />
                          )}
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                  {!outdoor && (
                    <Button
                      disabled={gameEnd}
                      onClick={doChores}
                      className={classes.button}
                    >
                      Do Chores
                    </Button>
                  )}
                </ButtonGroup>
                <Button
                  onClick={resetGame}
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                >
                  {gameEnd ? "Play again!" : "Reset Game"}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.characterContainer}>
                  <Character
                    name={name}
                    age={age}
                    image={getCharacterImage()}
                    sunburn={sunburn}
                    boredom={boredom}
                    outdoors={outdoor}
					sunscreen={sunscreen}
                  />
                </div>
              </Grid>
            </Grid>
          </Paper>
          <Copyright />
        </Grid>
        {gameEnd && 
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Game Over.</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Let's play again!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
              <Button onClick={resetGame} color="primary" autoFocus>
                Start Over!
              </Button>
            </DialogActions>
          </Dialog>
        }
      </React.Fragment>
    </ThemeProvider>
  )
}