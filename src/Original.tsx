import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component, ClassAttributes } from "react";

// UX improvement: Does not account for hours. E.g. if secs = 3668, this will show: 61:08,
// instead of 01:00:08
const formattedSeconds = (sec: number) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

// TS improvement: Should explicitly set component's State type instead of any
class Stopwatch extends Component<StopwatchProps, any> {
  // Bug/Error: incrementer is never initialized
  // Bug: incrementer should be part of state
  incrementer: any;

  // Bug:laps should be part of state to properly update view
  laps: any[];
  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      lastClearedIncrementer: null,
    };
    this.laps = [];
    // Bug: Event handlers aka handleStartClick, handleStopClick, etc. are not
    // bound to to an instance in the constructor.
    // this.handleStartClick = this.handleStartClick.bind(this)
  }
  handleStartClick() {
    // Bug: see comment in constructor, incrementer should be part of state, use setState to update
    this.incrementer = setInterval(
      () =>
        // bad practice, source of possible future bug: should use callback to update state when using previous state values
        this.setState({
          secondsElapsed: this.state.secondsElapsed + 1,
        }),
      1000
    );
  }
  handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer,
    });
  }

  handleResetClick() {
    clearInterval(this.incrementer);
    // Bug: see comment in constructor, laps should be part of state, use setState to update
    // poorly formatted: ";" instead of ","
    this.laps = [],
      this.setState({
        secondsElapsed: 0,
      });
  }
  // Spelling: handleLapClick instead of "Lab" (non-breaking, just readability)
  handleLabClick() {
    this.laps = this.laps.concat([this.state.secondsElapsed]);
    // See comment in constructor: laps needs to be in state so view should update automatically
    this.forceUpdate();
  }
  handleDeleteClick(index: number) {
    // No need to return a callback here 
    return () => this.laps.splice(index, 1);
  }
  render() {
    const { secondsElapsed, lastClearedIncrementer } = this.state;
    return (
      // CSS classes referenced to here are missing in the styles.css file.  
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {secondsElapsed === 0 || this.incrementer === lastClearedIncrementer ? (
          <button
            type="button"
            className="start-btn"
            onClick={this.handleStartClick}
          >
            start
          </button>
        ) : (
          <button
            type="button"
            className="stop-btn"
            onClick={this.handleStopClick}
          >
            stop
          </button>
        )}
        {secondsElapsed !== 0 && this.incrementer !== lastClearedIncrementer ? (
          <button type="button" onClick={this.handleLabClick}>
            lap
          </button>
        ) : null}
        {secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer ? (
          <button type="button" onClick={this.handleResetClick}>
            reset
          </button>
        ) : null}
        <div className="stopwatch-laps">
          {this.laps &&
            this.laps.map((lap, i) => (
            // Bug/bad pracice: missing key for elements in array
              <Lap
                index={i + 1}
                lap={lap}
                onDelete={this.handleDeleteClick(i)}
              />
            ))}
        </div>
      </div>
    );
  }
}
const Lap = (props: { index: number; lap: number; onDelete: () => {} }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}{" "}
    <button onClick={props.onDelete}> X </button>
  </div>
);

ReactDOM.render(
  <Stopwatch initialSeconds={0} />,
  // Traditioanlly root is used as the Id in the html file.  
  document.getElementById("content")
);
