import {
  createStore as reduxCreateStore,
  Dispatch as ReduxDispatch,
} from "redux";
import { Socket, io } from "socket.io-client";
import { getType } from "typesafe-actions";
import { addSocket, addTrap, IActions, updateGameData } from "./actions";
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
        // TODO (Manan) - Move socket emitter elsewhere
        state.socket?.emit("updateGameData", updatedTrapwordsData);
      }

      return {
        ...state,
        trapwordsData: updatedTrapwordsData,
      };
    case getType(updateGameData):
      console.log("New data payload!!", action.payload);
      return {
        ...state,
        trapwordsData: action.payload,
      };
    default:
      return state;
  }
}

export const createStore = () => {
  const store = reduxCreateStore(game);
  const socket = io(server_url).connect();
  store.dispatch(addSocket(socket));
  return store;
};

export type Dispatch = ReduxDispatch<IActions>;
