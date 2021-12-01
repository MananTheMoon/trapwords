import { createAction, ActionType } from "typesafe-actions";
import { ITrapwordsData } from "./store";
import { Socket } from "socket.io-client";

export const addSocket = createAction("ADD_SOCKET")<Socket>();
export const updateGameData = createAction("SET_GAME_DATA")<ITrapwordsData>();
export const addTrap = createAction("ADD_TRAP")<{
  targetTeam: string;
  fromTeam: string;
  index: number;
  word: string;
}>();

export type IActions =
  | ActionType<typeof addSocket>
  | ActionType<typeof updateGameData>
  | ActionType<typeof addTrap>;
