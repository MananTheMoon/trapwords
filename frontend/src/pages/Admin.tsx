import React from "react";
import { connect, useDispatch } from "react-redux";
import { IState, ITrapwordsData } from "../store/store";
import { Socket } from "socket.io-client";
import { TrapwordInput } from "../components/TrapwordInput";
import { GameUpdater } from "../components/GameUpdater";
import { addTrap, clearTraps, setTrapCount, setWord } from "../store/actions";
import { Button } from "react-bootstrap";

interface ITeamProps {
  socket?: Socket;
  trapwordsData: ITrapwordsData;
}

export const AdminUnconnected = ({ socket, trapwordsData }: ITeamProps) => {
  const dispatch = useDispatch();

  return (
    <div className="d-flex flex-column pt-2">
      <div className="p-2">
        <p className="text-center h2">Admin</p>
        <hr />
        <div>Section here for main stuff and buttons</div>
        <Button
          onClick={() => {
            dispatch(clearTraps());
          }}
        >
          Clear all Trap words
        </Button>
        <hr />
        <div className="d-flex flex-row">
          {Object.keys(trapwordsData.teamData).map((targetTeam) => {
            const teamData = trapwordsData.teamData[targetTeam];
            return (
              <div className="d-flex flex-column px-2 flex-grow-1 border p-2">
                <div className="d-flex flex-row align-items-center">
                  <div>Team {targetTeam}'s word is:</div>
                  <div className="h3 bg-warning p-1 rounded mx-2">
                    {teamData.word?.toUpperCase()}
                  </div>
                </div>
                <div className="d-flex flex-row">
                  Change Word:
                  <input
                    value={teamData.word}
                    onChange={(e) => {
                      dispatch(
                        setWord({ team: targetTeam, word: e.target.value })
                      );
                    }}
                  />
                </div>
                <div className="d-flex flex-row">
                  <div>Trap Count:</div>
                  <div className="w-25">
                    <input
                      type="number"
                      value={teamData.trapCount}
                      onChange={(e) => {
                        dispatch(
                          setTrapCount({
                            team: targetTeam,
                            trapCount: Number(e.target.value),
                          })
                        );
                      }}
                      min={1}
                      max={10}
                    />{" "}
                  </div>
                </div>
                <hr />
                {Object.keys(teamData.traps).map((fromTeam) => {
                  return (
                    <div>
                      <div>Traps set by team {fromTeam}</div>
                      <div>
                        {[...Array(teamData.trapCount)].map((a, i) => {
                          const word = teamData.traps[fromTeam]?.[i];
                          return (
                            <TrapwordInput
                              word={word}
                              onChange={(newWord) => {
                                dispatch(
                                  addTrap({
                                    targetTeam,
                                    fromTeam,
                                    index: i,
                                    word: newWord,
                                  })
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                      <hr />
                    </div>
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

export const Admin = connect(mapStateToProps)(AdminUnconnected);
