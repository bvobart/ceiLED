import React from 'react';
import { Typography, Link, TextField } from '@material-ui/core';
import useAuthToken from '../hooks/api/useAuthToken';

interface AboutProps {
  className?: string
}

const About = (props: AboutProps) => {
  const authToken = useAuthToken();

  return (
    <div className={props.className}>
      <Typography variant='body2' gutterBottom>
        CeiLED is a suite of software that I made in order to control the LED strips on my ceiling.
        The source code of CeiLED is open source and can be found <Link href='https://github.com/bvobart/ceiLED'>on GitHub</Link>.
        Want to use CeiLED in your own home? Let me know and I can help you set it up ;)
      </Typography>
      <br />
      <Typography variant='button' style={{ marginLeft: '8px' }}>Authorisation</Typography>
      <br /><br />
      <Typography variant='body2' gutterBottom>
        CeiLED controls the lighting in my home and I don't want literally anybody to be able to control those through this app.
        Therefore, it is only possible to connect to the server if you are connected to my home local area network.
        Furthermore, your authorisation token needs to be registered in a database at the server, otherwise the server will simply
        reject your attempts at changing my lights. If you want your authorisation token added to my database, let me know :)
        <br /><br />
        Your authorisation token is:
      </Typography>
      <TextField 
        variant='outlined'
        value={authToken}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default About;
