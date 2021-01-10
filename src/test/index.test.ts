import { renderHook } from "@testing-library/react-hooks";
import { useStableReference } from "../index";
import { suite } from "uvu";
import { is } from "uvu/assert";

const test = suite("useMachine");

test.before(() => {
  global.__DEV__ = true;
});

test("useStableReference", () => {
  const initial = { hello: "world" };

  const { result, rerender } = renderHook(
    (value) => useStableReference(value),
    {
      initialProps: initial,
    }
  );

  is(
    result.current,
    initial,
    "Should be the same reference after first render"
  );

  rerender({ hello: "world" });
  rerender({ hello: "world" });
  rerender({ hello: "world" });

  is(
    result.current,
    initial,
    "Should be the same reference after rerenders with new values"
  );

  const next = { hello: "you" };
  rerender(next);

  is(result.current, next, "Should return the reference of the new value");
});

test.run();
