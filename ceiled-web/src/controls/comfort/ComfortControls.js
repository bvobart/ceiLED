import React, { Component } from "react";
import { ControllerSocketContext } from "../../context/ControllerSocketProvider";
import { Grid } from "@material-ui/core";
import SimpleRgbFadeTile from "./tiles/SimpleRgbFadeTile";
import RippleRgbFadeTile from "./tiles/RippleRgbFadeTile";
import SimpleWarmFadeTile from "./tiles/SimpleWarmFadeTile";
import RippleWarmFadeTile from "./tiles/RippleWarmFadeTile";
import SimpleColdFadeTile from "./tiles/SimpleColdFadeTile";
import RippleColdFadeTile from "./tiles/RippleColdFadeTile";

class ComfortControls extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(message) {
    this.send(message);
  }

  render() {
    return (
      <ControllerSocketContext.Consumer>
        {({ send }) => {
          this.send = send;
          return (
            <Grid container>
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
