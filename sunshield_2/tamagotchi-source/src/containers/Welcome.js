import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Copyright from '../components/Copyright';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import welcomePet from '../assets/character/welcomeKid.svg';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF9800', // Orange
    },
    secondary: {
      main: '#009688', // Teal
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundColor: '#ff9800',
  },
  image: {
    backgroundImage: `url(${welcomePet})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#f2f4f5',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const dayDurationInputProps = {
  step: 1,
  min: 1,
  max: 60,
};

export default function Welcome() {
  const history = useHistory();
  const classes = useStyles();
  const [nameValue, setNameValue] = useState('Sunny');
  const [dayDurationValue, setDayDurationValue] = useState(5);

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  }

  const handleDayDurationChange = (event) => {
    setDayDurationValue(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (nameValue !== '' && dayDurationValue !== '') {
      history.push('/play/' + encodeURIComponent(nameValue) + "/" + dayDurationValue);
    }

  }  

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Start by setting the name!
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit} method="post">
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="pet-name"
                label="Your Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={nameValue} 
                onChange={handleNameChange}
              />
              <Typography component='p' variant='body1'>
                Try to keep the kid safe from the sun!
                <br />
                <br />
                The UV will <b>change every 5 days</b>
                <br />
                The <b>higher</b> the UV index, the more <b>dangerous</b> the sun is.
                <br />
                You can escape the sun by going inside, but be careful! <b>Being inside makes the kid bored!</b>
                <br />
                You can do <b>chores while inside</b> to earn <b>coins</b> but your boredom will go up even more!
                <br />
                You can spend <b>5 coins to buy sunscreen</b> to reduce your sunburn but the <b>sunscreen wears off after 5 days.</b>

              </Typography>
              {/* <TextField
                id="day-duration"
                label="Day Duration (in seconds)"
                variant="outlined"
                type="number"
                defaultValue={dayDurationValue}
                inputProps={dayDurationInputProps}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDayDurationChange}
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Start Game!
              </Button>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}