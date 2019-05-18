import React, { Component } from "react";
import { ControllerSocketContext } from "../../context/ControllerSocketProvider";
import { Grid } from "@material-ui/core";
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
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(message) {
    if (!message.data.patternOptions.interpolation) {
      message.data.patternOptions.interpolation = this.state.interpolation;
    }
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
