import React, { Component } from "react";
import { ControllerSocketContext } from "../../context/ControllerSocketProvider";
import { Grid } from "@material-ui/core";
import Tile from "../../common/Tile";

class ComfortControls extends Component {
  render() {
    // TODO: determine comfort controls. 
    // E.g. slow RGB fade, RGBPYCW fade, slow warm colours fade (red, yellow, orange etc.), 
    // slow colder colours fade (purple, blue, cyan etc.) 
    return (
      <ControllerSocketContext.Consumer>
        {({ send }) => {
          this.send = send;
          return (
            <Grid 
              container
              justify='space-between' // TODO: fix tile layout
            >
              <Grid item><Tile /></Grid>
              <Grid item><Tile /></Grid>
              <Grid item><Tile /></Grid>
              <Grid item><Tile /></Grid>
              <Grid item><Tile /></Grid>
              <Grid item><Tile /></Grid>
              <Grid item><Tile /></Grid>
              <Grid item><Tile /></Grid>
            </Grid>
          );
        }}
      </ControllerSocketContext.Consumer>
    )
  }
}

export default ComfortControls;
