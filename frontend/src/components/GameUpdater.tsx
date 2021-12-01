import React from "react";
import { connect, useDispatch } from "react-redux";
import { IState, ITrapwordsData } from "../store/store";
import { updateGameData } from "../store/actions";
import { Socket } from "socket.io-client";

interface IGameUpdateUnconnected {
  socket?: Socket;
}

const GameUpdaterUnconnected = ({ socket }: IGameUpdateUnconnected) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    socket?.on("gameData", (gameData: ITrapwordsData) => {
      console.log("Retrieved ...", gameData);
      dispatch(updateGameData(gameData));
    });
  }, [socket, dispatch]);
  return <></>;
};

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
});

export const GameUpdater = connect(mapStateToProps)(GameUpdaterUnconnected);
