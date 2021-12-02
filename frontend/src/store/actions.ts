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
export const clearTraps = createAction("CLEAR_TRAPS")<void>();
export const lockTraps = createAction("LOCK_TRAPS")<void>();
export const setWord =
  createAction("SET_WORD")<{ team: string; word: string }>();
export const setTrapCount =
  createAction("SET_TRAP_COUNT")<{ team: string; trapCount: number }>();

export type IActions =
  | ActionType<typeof addSocket>
  | ActionType<typeof updateGameData>
  | ActionType<typeof addTrap>
  | ActionType<typeof clearTraps>
  | ActionType<typeof lockTraps>
  | ActionType<typeof setWord>
  | ActionType<typeof setTrapCount>;
