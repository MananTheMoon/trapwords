import {
  createStore as reduxCreateStore,
  Dispatch as ReduxDispatch,
} from "redux";
import { Socket, io } from "socket.io-client";
import { getType } from "typesafe-actions";
import {
  addSocket,
  addTrap,
  clearTraps,
  IActions,
  updateGameData,
} from "./actions";
import { server_url } from "../consts";
import _ from "lodash";

export interface ITrapwordsData {
  teamData: {
    [key: string]: {
      word?: string;
      trapCount: number;
      traps: {
        [key: string]: {
          [key: number]: string;
        };
      };
    };
  };
}

export interface IState {
  socket?: Socket;
  trapwordsData: ITrapwordsData;
}

const emptyStore: IState = {
  trapwordsData: {
    teamData: {},
  },
};

function game(state: IState = emptyStore, action: IActions): IState {
  switch (action.type) {
    case getType(addSocket):
      console.log("ADDING SOCKET ONCE?!");
      return {
        ...state,
        socket: action.payload,
      };
    case getType(addTrap):
      const trapwordsDataToMerge = {
        teamData: {
          [action.payload.targetTeam]: {
            traps: {
              [action.payload.fromTeam]: {
                [action.payload.index]: action.payload.word,
              },
            },
          },
        },
      };
      const updatedTrapwordsData = _.merge(
        trapwordsDataToMerge,
        state.trapwordsData
      );
      updatedTrapwordsData.teamData[action.payload.targetTeam].traps[
        action.payload.fromTeam
      ][action.payload.index] = action.payload.word;
      if (state.socket) {
        state.socket?.emit("addTrap", action.payload);
      }

      return {
        ...state,
        trapwordsData: updatedTrapwordsData,
      };
    case getType(updateGameData):
      return {
        ...state,
        trapwordsData: action.payload,
      };
    case getType(clearTraps):
      console.log("Clearing traps!!");
      const newTrapWordsData: ITrapwordsData = {
        ...state.trapwordsData,
        teamData: Object.keys(state.trapwordsData.teamData).reduce(
          (acc, key) => {
            return {
              ...acc,
              [key]: {
                ...state.trapwordsData.teamData[key],
                traps: {},
              },
            };
          },
          {}
        ),
      };
      state.socket?.emit("updateGameData", newTrapWordsData);
      return {
        ...state,
        trapwordsData: newTrapWordsData,
      };
    default:
      return state;
  }
}

export const createStore = () => {
  const store = reduxCreateStore(game);
  console.log("STore create ahoy");
  const socket = io(server_url);
  store.dispatch(addSocket(socket));
  return store;
};

export type Dispatch = ReduxDispatch<IActions>;
