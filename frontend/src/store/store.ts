import {
  createStore as reduxCreateStore,
  Dispatch as ReduxDispatch,
} from "redux";
import { Socket, io } from "socket.io-client";
import { getType } from "typesafe-actions";
import { addSocket, IActions } from "./actions";
import { server_url } from "../consts";

export interface ITrapwordsData {}

export interface IState {
  socket?: Socket;
  trapwordsData: ITrapwordsData;
}

const emptyStore: IState = {
  trapwordsData: {},
};

function game(state: IState = emptyStore, action: IActions) {
  switch (action.type) {
    case getType(addSocket):
      return {
        ...state,
        socket: action.payload,
      };
  }
  return state;
}

export const createStore = () => {
  console.log("Here...f.");
  const store = reduxCreateStore(game);
  const socket = io(server_url).connect();
  // console.log("Added socket", socket);
  // store.dispatch(addSocket(socket));
  return store;
};

export type Dispatch = ReduxDispatch<IActions>;
