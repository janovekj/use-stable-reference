import { useEffect, useState } from "react";

const dev = {
  warn: (...args: Parameters<typeof console.warn>) =>
    global.__DEV__ && console.warn(...args),
  error: (...args: Parameters<typeof console.error>) =>
    global.__DEV__ && console.error(...args),
};

const serializeValue = <Value extends any>(value: Value) =>
  typeof value === "function"
    ? value.toString()
    : typeof value === "object"
    ? JSON.stringify(value)
    : value.toString();

const useStableReference = <Value extends any>(value: Value): Value => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    // Log warning for first render
    if (
      value === internalValue &&
      !["function", "object"].includes(typeof value)
    ) {
      dev.warn(
        `Attempting to get stable reference for value which might not need it: ${value}`
      );
    }
  }, [internalValue, value]);

  useEffect(() => {
    const serializedValue = serializeValue(value);
    if (serializeValue(internalValue) !== serializedValue) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  return internalValue;
};

export { useStableReference };
