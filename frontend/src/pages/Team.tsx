import React from "react";
import { useParams } from "react-router";
import { connect, useDispatch } from "react-redux";
import { IState, ITrapwordsData } from "../store/store";
import { Socket } from "socket.io-client";
import { TrapwordInput } from "../components/TrapwordInput";
import { GameUpdater } from "../components/GameUpdater";
import { addTrap } from "../store/actions";

interface ITeamProps {
  socket?: Socket;
  trapwordsData: ITrapwordsData;
}

export const TeamUnconnected = ({ socket, trapwordsData }: ITeamProps) => {
  const dispatch = useDispatch();
  const { teamNumber } = useParams();
  if (!teamNumber) {
    return <div>Error</div>;
  }
  return (
    <div className="d-flex flex-column pt-2">
      <div className="p-2">
        <p className="text-center h2">Team {teamNumber}</p>
        <hr />
        <div className="d-flex flex-row">
          {Object.keys(trapwordsData.teamData)
            .filter((targetTeam) => targetTeam !== teamNumber)
            .map((targetTeam) => {
              const teamData = trapwordsData.teamData[targetTeam];
              return (
                <div className="d-flex flex-column px-2 flex-grow-1 border p-2">
                  <div className="d-flex flex-row align-items-center">
                    <div>Team {targetTeam}'s word is:</div>
                    <div className="h3 bg-warning p-1 rounded mx-2">
                      {teamData.word?.toUpperCase()}
                    </div>
                  </div>
                  <div>Write traps for this word below:</div>
                  {[...Array(teamData.trapCount)].map((a, i) => {
                    const word = teamData.traps[teamNumber]?.[i];
                    return (
                      <TrapwordInput
                        word={word}
                        onChange={(newWord) => {
                          dispatch(
                            addTrap({
                              targetTeam,
                              fromTeam: teamNumber,
                              index: i,
                              word: newWord,
                            })
                          );
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
        </div>
        <GameUpdater />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  trapwordsData: state.trapwordsData,
});

export const Team = connect(mapStateToProps)(TeamUnconnected);
