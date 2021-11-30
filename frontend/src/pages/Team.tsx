import React from "react";
import { useParams } from "react-router";

export const Team = () => {
  const { teamNumber } = useParams();
  return (
    <>
      <div>You picked {teamNumber}</div>
    </>
  );
};
