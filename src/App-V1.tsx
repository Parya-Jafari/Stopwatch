// V1 Minimal changes to get the code to working stage
import { Component, ClassAttributes } from "react";

const formattedSeconds = (sec: number) => {
  return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
};

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

interface StopWatchState  {
  secondsElapsed: number;
  incrementerId: number | undefined;
  lastClearedIncrementer: number | undefined;
  laps: number[];
}

class Stopwatch extends Component<StopwatchProps, StopWatchState> {
  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      incrementerId: undefined,
      lastClearedIncrementer: undefined,
      laps: [],
    };

    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleLapClick = this.handleLapClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.timer = this.timer.bind(this);
  }
  timer() {
    this.setState((prevState: StopWatchState) => {
      return { secondsElapsed: prevState.secondsElapsed + 1 };
    });
  }

  handleStartClick() {
    const intervalId = window.setInterval(this.timer, 1000);
    this.setState({ incrementerId: intervalId });
  }

  handleStopClick() {
    this.setState((prevState: StopWatchState) => {
      return {
        lastClearedIncrementer: prevState.incrementerId,
      };
    });
    clearInterval(this.state.incrementerId);
  }

  handleResetClick() {
    clearInterval(this.state.incrementerId);
    this.setState({
      secondsElapsed: 0,
      laps: [],
    });
  }
  handleLapClick() {
    this.setState((prevState: StopWatchState) => {
      return {
        laps: prevState.laps.concat([prevState.secondsElapsed]),
      };
    });
  }

  handleDeleteClick(index: number) {
    this.setState((prevState: StopWatchState) => {
      const lapsUpdated = [...prevState.laps];
      lapsUpdated.splice(index, 1);
      return {
        laps: lapsUpdated,
      };
    });
  }

  render() {
    const { secondsElapsed, lastClearedIncrementer, incrementerId, laps } =
      this.state;
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {secondsElapsed === 0 || incrementerId === lastClearedIncrementer ? (
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
        {secondsElapsed !== 0 && incrementerId !== lastClearedIncrementer ? (
          <button type="button" onClick={this.handleLapClick}>
            lap
          </button>
        ) : null}
        {secondsElapsed !== 0 && incrementerId === lastClearedIncrementer ? (
          <button type="button" onClick={this.handleResetClick}>
            reset
          </button>
        ) : null}
        <div className="stopwatch-laps">
          {laps &&
            laps.map((lap, i) => (
              <Lap
                index={i + 1}
                lap={lap}
                onDelete={() => {
                  this.handleDeleteClick(i);
                }}
                key={`lap-${i}`}
              />
            ))}
        </div>
      </div>
    );
  }
}
const Lap = (props: { index: number; lap: number; onDelete: () => void }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}{" "}
    <button onClick={props.onDelete}> X </button>
  </div>
);


export default Stopwatch;
