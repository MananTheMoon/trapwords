import { createAction, ActionType } from "typesafe-actions";
import { ITrapwordsData } from "./store";
import { Socket } from "socket.io-client";

export const addSocket = createAction("ADD_SOCKET")<Socket>();
export const updateGameData = createAction("SET_GAME_DATA")<ITrapwordsData>();

export type IActions =
  | ActionType<typeof addSocket>
  | ActionType<typeof updateGameData>;
