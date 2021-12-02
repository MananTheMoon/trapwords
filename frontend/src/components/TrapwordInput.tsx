import React from "react";

interface ITrapwordInput {
  editable: boolean;
  word: string;
  onChange: (newWord: string) => void;
}

export const TrapwordInput = ({ editable, word, onChange }: ITrapwordInput) => {
  console.log("The word to show is....", editable);
  return (
    <div className="p-2">
      <input
        disabled={!editable}
        value={word || ""}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};
