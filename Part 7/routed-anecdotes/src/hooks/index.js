import { useState } from "react";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    console.log("Hello");
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };
  return { type, value, onChange, reset };
};
