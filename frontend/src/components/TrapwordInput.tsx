import React from "react";

interface ITrapwordInput {
  word: string;
  onChange: (newWord: string) => void;
}

export const TrapwordInput = ({ word, onChange }: ITrapwordInput) => {
  return (
    <div className="p-2">
      <input
        value={word}
        onChange={(e) => {
          console.log("Dis value changed somehow??");
          onChange(e.target.value);
        }}
      />
    </div>
  );
};