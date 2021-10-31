import * as React from "react";
import "./styles.css";

enum Direction {
  Right = "right",
  Down = "down",
  Left = "left",
  Up = "up"
}

enum ArrowKeys {
  Right = 39,
  Down = 40,
  Left = 37,
  Up = 38
}

export default function App() {
  const [direction, setDirection] = React.useState(Direction.Down);
  const [moving, setMoving] = React.useState(false);
  const [, setTick] = React.useState(0);

  const refKeyState = React.useRef({
    up: false,
    down: false,
    left: false,
    right: false
  });

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keyState = refKeyState.current;
      switch (event.keyCode) {
        case ArrowKeys.Right:
          keyState.right = true;
          break;
        case ArrowKeys.Down:
          keyState.down = true;
          break;
        case ArrowKeys.Left:
          keyState.left = true;
          break;
        case ArrowKeys.Up:
          keyState.up = true;
          break;
      }
    },
    []
  );

  const onKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keyState = refKeyState.current;
      switch (event.keyCode) {
        case ArrowKeys.Right:
          keyState.right = false;
          break;
        case ArrowKeys.Down:
          keyState.down = false;
          break;
        case ArrowKeys.Left:
          keyState.left = false;
          break;
        case ArrowKeys.Up:
          keyState.up = false;
          break;
      }
    },
    []
  );

  React.useEffect(() => {
    let timerId: number | undefined;

    const onTick = () => {
      // Sync sprite direction
      const keyState = refKeyState.current;

      if (keyState.right) {
        setDirection(Direction.Right);
        setMoving(true);
        return;
      }
      if (keyState.down) {
        setDirection(Direction.Down);
        setMoving(true);
        return;
      }
      if (keyState.left) {
        setDirection(Direction.Left);
        setMoving(true);
        return;
      }
      if (keyState.up) {
        setDirection(Direction.Up);
        setMoving(true);
        return;
      }

      setMoving(false);

      setTick((value) => ++value);
    };

    const makeTickHandler = () => {
      timerId = setTimeout(() => {
        onTick();
        makeTickHandler();
      }, 100);
    };

    makeTickHandler();

    return () => {
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="App" tabIndex={0} onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div className="sprite-container">
        <div
          className={`sprite-girl ${direction} ${moving ? "animate" : ""}`}
        />
      </div>
    </div>
  );
}
