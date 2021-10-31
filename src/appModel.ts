export const mazeSize = 10;

// Item lifetime in game ticks
const itemLifetime = 25;

export enum Direction {
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

export type Location = [number, number];

export enum Item {
  Flower = "flower",
  Heart = "heart"
}

export interface ItemState {
  item: Item;
  age: number; // Age in game ticks
}

export type ItemMap = {
  [row: number]: {
    [column: number]: ItemState;
  };
};

export interface AppState {
  maze: number[][];
  player: Location;
  items: ItemMap;
  collected: Record<Item, number>;
  direction: Direction;
  moving: boolean;
}

export type GameTile = EmptyTile | WallTile | ItemTile | PlayerTile;

export enum TileType {
  Empty = "empty",
  Wall = "wall",
  Item = "item",
  Player = "player"
}

export interface CommonTile {
  type: TileType;
}

export interface EmptyTile extends CommonTile {
  type: TileType.Empty;
}

export interface WallTile extends CommonTile {
  type: TileType.Wall;
  wallId: number; // Which wall to render
}

export interface ItemTile extends CommonTile {
  type: TileType.Item;
  item: Item;
  lifeRemaining: number; // Number from 0..1
}

export interface PlayerTile extends CommonTile {
  type: TileType.Player;
  direction: Direction;
  moving: boolean;
}

export enum ActionType {
  Update = "update"
}

export type Action = UpdateAction;

export interface KeyState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export interface UpdateAction {
  type: ActionType.Update;
  keyState: KeyState;
}

function updatePlayerState(
  keyState: KeyState,
  state: Pick<AppState, "direction" | "moving">
) {
  if (keyState.right) {
    state.direction = Direction.Right;
    state.moving = true;
    return;
  }
  if (keyState.down) {
    state.direction = Direction.Down;
    state.moving = true;
    return;
  }
  if (keyState.left) {
    state.direction = Direction.Left;
    state.moving = true;
    return;
  }
  if (keyState.up) {
    state.direction = Direction.Up;
    state.moving = true;
    return;
  }

  state.moving = false;
}

function makeEmptyRow(): number[] {
  return new Array(mazeSize).fill(0);
}

function makeEmptyMaze(): number[][] {
  return new Array(mazeSize).map(() => makeEmptyRow());
}

export function getInitialState(): AppState {
  return {
    maze: makeEmptyMaze(),
    player: [Math.floor(mazeSize / 2), Math.floor(mazeSize / 2)],
    items: {},
    collected: {
      [Item.Flower]: 0,
      [Item.Heart]: 0
    },
    direction: Direction.Right,
    moving: false
  };
}

export function selectWorldTiles(state: AppState): GameTile[][] {
  return state.maze.map((mazeRow, row) =>
    mazeRow.map((mazeValue, col) => {
      if (state.player[0] === row && state.player[1] === col) {
        return {
          type: TileType.Player,
          direction: state.direction,
          moving: state.moving
        };
      }

      const itemState = state.items[row]?.[col];

      if (itemState) {
        return {
          type: TileType.Item,
          item: itemState.item,
          lifeRemaining: 1 - itemState.age / itemLifetime
        };
      }

      if (mazeValue > 0) {
        return {
          type: TileType.Wall,
          wallId: mazeValue
        };
      }

      return {
        type: TileType.Empty
      };
    })
  );
}

function getNextPlayerPosition(state: AppState): Location {
  if (state.moving) {
    const newLocation = [...state.player];

    switch (state.direction) {
      case Direction.Right:
        ++newLocation[1];
        break;

      case Direction.Left:
        --newLocation[1];
        break;

      case Direction.Up:
        --newLocation[0];
        break;

      case Direction.Down:
        ++newLocation[0];
        break;
    }

    // Check if player is within maze bounds
    if (newLocation[0] < 0 || newLocation[0] >= mazeSize) {
      return state.player;
    }

    // Check if player is within maze bounds
    if (newLocation[1] < 0 || newLocation[1] >= mazeSize) {
      return state.player;
    }

    // Make sure player hasn't walked into a wall
    if (state.maze[newLocation[0]][newLocation[1]] > 0) {
      return state.player;
    }

    return newLocation;
  }

  return state.player;
}

export function gameReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.Update: {
      const newState = { ...state };

      updatePlayerState(action.keyState, newState);
      const newLocation = getNextPlayerPosition(newState);
      const itemAtNewLocation = newState.items[3][5];

      if (itemAt) return newState;
    }
  }

  return state;
}
