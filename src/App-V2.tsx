// V2 Modern React, use hooks, proper Type definitions, show hh:mm:ss
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Update time formatting to show hours as well
const formattedSeconds = (sec: number) =>
  new Date(sec * 1000).toISOString().substring(11, 19);

interface StopwatchProps {
  initialSeconds: number;
}

// Re-wrote as functional component with hooks
const Stopwatch = ({ initialSeconds }: StopwatchProps) => {
  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);

  // if we expect initialSeconds as a prop to change:
  useEffect(() => {
    setSecondsElapsed(initialSeconds);
  }, [initialSeconds]);

  const [laps, setLaps] = useState<number[]>([]);
  // Use ref instead of state for incrementer
  const incrementerRef = useRef<number | undefined>(undefined);
  // No need to keep lastClearedIncrementer, just a boolean does the trick
  const [stopped, setStopped] = useState(true);

  useEffect(() => {
    if (!stopped) {
      incrementerRef.current = window.setInterval(() => {
        setSecondsElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (incrementerRef.current) {
        clearInterval(incrementerRef.current);
        incrementerRef.current = undefined;
      }
    }

    // Cleanup incrementer on component unmount
    return () => {
      if (incrementerRef.current) {
        clearInterval(incrementerRef.current);
      }
    };
  }, [stopped]);

  const handleStartStopClick = () => {
    setStopped((prev) => !prev);
  };

  const handleResetClick = () => {
    setSecondsElapsed(0);
    setLaps([]);
  };

  const handleLapClick = useCallback(() => {
    setLaps((prev) => prev.concat([secondsElapsed]));
  }, [secondsElapsed]);

  const handleDeleteClick = useCallback((index: number) => {
    setLaps((prev) => {
      const lapsUpdated = [...prev];
      lapsUpdated.splice(index, 1);
      return lapsUpdated;
    });
  }, []);

  return (
    <div className="stopwatch">
      <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
      <button
        type="button"
        className="start-btn"
        onClick={handleStartStopClick}
      >
        {stopped ? "start" : "stop"}
      </button>
      {!stopped ? (
        <button type="button" onClick={handleLapClick}>
          lap
        </button>
      ) : (
        <></>
      )}
      {secondsElapsed !== 0 && stopped ? (
        // The reset button should show if time is not 0, even if it's through "initialSeconds" prop
        <button type="button" onClick={handleResetClick}>
          reset
        </button>
      ) : (
        <></>
      )}
      <div className="stopwatch-laps">
        {laps &&
          laps.map((lap, i) => (
            <Lap
              index={i + 1}
              lap={lap}
              onDelete={() => {
                handleDeleteClick(i);
              }}
              // Add key to components in an array
              key={`lap-${i}`}
            />
          ))}
      </div>
    </div>
  );
};

// Memoize Lap to avoid rerenders when props don't change
const Lap = memo(function Lap(props: {
  index: number;
  lap: number;
  onDelete: () => void;
}) {
  return (
    <div key={props.index} className="stopwatch-lap">
      <strong>{props.index}</strong>
      {`/ ${formattedSeconds(props.lap)} `}
      <button onClick={props.onDelete}> X </button>
    </div>
  );
});

export default Stopwatch;
