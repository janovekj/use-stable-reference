import { renderHook } from "@testing-library/react-hooks";
import { useStableReference } from "../index";
import { suite } from "uvu";
import { is } from "uvu/assert";

const test = suite("useMachine");

test.before(() => {
  global.__DEV__ = true;
});

test("object", () => {
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

test("function without dependencies", () => {
  const initial = () => console.log("test");

  const { result, rerender } = renderHook((fn) => useStableReference(fn), {
    initialProps: initial,
  });

  is(
    result.current,
    initial,
    "Should be the same reference after first render"
  );

  rerender(() => console.log("test"));
  rerender(() => console.log("test"));
  rerender(() => console.log("test"));

  is(
    result.current,
    initial,
    "Should be the same reference after rerenders with new values"
  );

  const next = () => console.log("test2");
  rerender(next);

  is(result.current, next, "Should return the reference of the new value");
});

test("function with dependencies", () => {
  let someVar = 42;
  const initial = () => someVar;

  const { result, rerender } = renderHook(
    ([fn, deps]) => useStableReference(fn, deps),
    {
      initialProps: [initial, [someVar]] as [() => number, [number]],
    }
  );

  is(
    result.current,
    initial,
    "Should be the same reference after first render"
  );

  rerender([() => someVar, [someVar]]);
  rerender([() => someVar, [someVar]]);
  rerender([() => someVar, [someVar]]);

  is(
    result.current,
    initial,
    "Should be the same reference after rerenders with new reference and same dependencies"
  );

  const next = () => 123;
  rerender([next, [someVar]]);

  is(
    result.current,
    next,
    "Should update the reference when implementation changes and reference stays the same"
  );

  someVar = 123;
  const next2 = () => someVar;
  rerender([next2, [someVar]]);

  is(
    result.current,
    next2,
    "Should update the reference when a dependency changes"
  );
});

test.run();
