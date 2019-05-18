import React, { Component } from "react";
import { ControllerSocketContext } from "../../context/ControllerSocketProvider";
import { Grid, Typography } from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import SimpleRgbFadeTile from "./tiles/SimpleRgbFadeTile";
import RippleRgbFadeTile from "./tiles/RippleRgbFadeTile";
import SimpleWarmFadeTile from "./tiles/SimpleWarmFadeTile";
import RippleWarmFadeTile from "./tiles/RippleWarmFadeTile";
import SimpleColdFadeTile from "./tiles/SimpleColdFadeTile";
import RippleColdFadeTile from "./tiles/RippleColdFadeTile";
import FadeInterpolationSetting, { FadeInterpolations } from "../fade/FadeInterpolationSetting";

class ComfortControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interpolation: FadeInterpolations.LINEAR,
      speed: 10,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(message) {
    message.data.patternOptions.interpolation = this.state.interpolation;
    message.data.patternOptions.speed = this.state.speed;
    this.send(message);
  }

  render() {
    return (
      <ControllerSocketContext.Consumer>
        {({ send }) => {
          this.send = send;
          return (
            <Grid container>
              <Grid item xs={12}>
                <div style={{ marginLeft: 24, marginRight: 24 }}>  
                  <FadeInterpolationSetting 
                    value={this.state.interpolation} 
                    onChange={(interpolation) => this.setState({ interpolation })}
                  />
                </div> 
              </Grid>
              <Grid item container xs={12} style={{ marginLeft: 24, marginRight: 24 }}>
                  <Grid item xs={1}><Typography variant='caption'>Speed</Typography></Grid>
                  <Grid item xs={1}><Typography variant='caption'>{this.state.speed} BPM</Typography></Grid>
                  <Grid item xs={10}>
                    <Slider 
                      value={this.state.speed} 
                      min={1} max={300} step={1} 
                      onChange={(e, speed) => this.setState({ speed })} 
                      style={{ padding: '16px 0px' }}
                    />
                  </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs><SimpleRgbFadeTile onClick={this.handleClick} /></Grid>
                <Grid item xs><RippleRgbFadeTile onClick={this.handleClick} /></Grid>
              </Grid>
              <Grid item container sm={6} xs={12}>
                <Grid item xs><SimpleWarmFadeTile onClick={this.handleClick} /></Grid>
                <Grid item xs><RippleWarmFadeTile onClick={this.handleClick} /></Grid>
              </Grid>
              <Grid item container sm={6} xs={12}>
                <Grid item xs><SimpleColdFadeTile onClick={this.handleClick} /></Grid>
                <Grid item xs><RippleColdFadeTile onClick={this.handleClick} /></Grid>
              </Grid>
            </Grid>
          );
        }}
      </ControllerSocketContext.Consumer>
    )
  }
}

export default ComfortControls;
