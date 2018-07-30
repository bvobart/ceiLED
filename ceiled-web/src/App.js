import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import compose from 'recompose/compose';
import { theme } from './theme';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 960
    }
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;
    const isMobile = this.props.width === 'sm' ? window.innerWidth : 960;
    
    return (
      <Paper className={classes.root} style={{ width: isMobile }}>
        <CardHeader title='Jemoeder' />
      </Paper>
    )
  }
}

// import { CardTitle } from 'material-ui/Card';

// import LEDControls from './LEDControls';
// import PaperV0 from 'material-ui/Paper/Paper';
// import IconButton from 'material-ui/IconButton';
// import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
// import { greenA700, redA700 } from 'material-ui/styles/colors';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       enabled: true
//     };
//   }
  
//   render() {
//     const mainStyle = {
//       width: this.props.isMobile ? this.props.windowSize.innerWidth : this.props.mobileMaxWidth
//     }
    
//     return (
//       <Paper style={mainStyle}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <CardTitle title='CeiLED' subtitle='Controlling those LEDs on a ceiling near you ;)' />
//           <IconButton 
//             onClick={event => this.setState({ enabled: !this.state.enabled })}
//             iconStyle={{ height: 68, width: 68 }}
//             style={{ height: 84, width: 84, paddingRight: 16 }}
//           >
//             <PowerIcon 
//               color={this.state.enabled ? greenA700 : redA700 }
//             />
//           </IconButton>
//         </div>
//         <LEDControls enabled={this.state.enabled} />
//       </Paper>
//     );
//   }
// }

const StyledApp = compose(withStyles(styles), withWidth())(App);
const HotApp = hot(module)(() => 
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <StyledApp />
  </MuiThemeProvider>
);

export default HotApp;
