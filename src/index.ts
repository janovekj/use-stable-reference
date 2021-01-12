import { useEffect, useState } from "react";

const serializeValue = <Value extends any>(value: Value) =>
  typeof value === "function"
    ? value.toString()
    : typeof value === "object"
    ? JSON.stringify(value)
    : value.toString();

function assertFunctionOrObject(
  arg: unknown
): asserts arg is Function | object {
  if (!["function", "object"].includes(typeof arg)) {
    throw new Error(
      `Value must be of type object or function. Received ${typeof arg}`
    );
  }
}

function useStableReference<Value extends Function>(
  val: Value,
  deps: ReadonlyArray<any>
): Value;
function useStableReference<Value extends object>(val: Value): Value;
// function signature type intentionally open-ended to allow overloads
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useStableReference(...args) {
  const [value, dependencies] = args;

  assertFunctionOrObject(value);

  const [internalValue, setInternalValue] = useState(() => value);

  useEffect(() => {
    if (dependencies) {
      setInternalValue(() => value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    const serializedValue = serializeValue(value);
    if (serializeValue(internalValue) !== serializedValue) {
      setInternalValue(() => value);
    }
  }, [value, internalValue]);

  return internalValue;
}

export { useStableReference };
