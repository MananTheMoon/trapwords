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
  setScore,
  setTrapCount,
  setWord,
  updateGameData,
} from "./actions";
import { server_url } from "../consts";
import _ from "lodash";

export interface ITrapwordsData {
  teamData: {
    [key: string]: {
      score: number;
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
      const newTrapWordsData: ITrapwordsData = {
        ...state.trapwordsData,
        teamData: Object.keys(state.trapwordsData.teamData).reduce(
          (acc, key) => {
            return {
              ...acc,
              [key]: {
                ...state.trapwordsData.teamData[key],
                traps: {
                  ...Array.from(
                    Array(state.trapwordsData.teamData[key].trapCount).keys()
                  ).reduce((acc, i) => {
                    return {
                      ...acc,
                      [i]: "",
                    };
                  }, {}),
                },
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
    case getType(setWord):
      const updatedData = {
        ...state.trapwordsData,
        teamData: {
          ...state.trapwordsData.teamData,
          [action.payload.team]: {
            ...state.trapwordsData.teamData[action.payload.team],
            word: action.payload.word,
          },
        },
      };
      state.socket?.emit("setWord", action.payload);
      return {
        ...state,
        trapwordsData: updatedData,
      };
    case getType(setTrapCount):
      const updateData2 = {
        ...state.trapwordsData,
        teamData: {
          ...state.trapwordsData.teamData,
          [action.payload.team]: {
            ...state.trapwordsData.teamData[action.payload.team],
            trapCount: action.payload.trapCount,
          },
        },
      };
      state.socket?.emit("updateGameData", updateData2);
      return {
        ...state,
        trapwordsData: updateData2,
      };
    case getType(setScore):
      const updateData3 = {
        ...state.trapwordsData,
        teamData: {
          ...state.trapwordsData.teamData,
          [action.payload.team]: {
            ...state.trapwordsData.teamData[action.payload.team],
            score: action.payload.score,
          },
        },
      };
      state.socket?.emit("updateGameData", updateData3);
      return {
        ...state,
        trapwordsData: updateData3,
      };
    default:
      return state;
  }
}

export const createStore = () => {
  const store = reduxCreateStore(game);
  const socket = io(server_url);
  store.dispatch(addSocket(socket));
  return store;
};

export type Dispatch = ReduxDispatch<IActions>;
