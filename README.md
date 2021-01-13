# useStableReference

Dependency arrays in React can be hard to deal with when you're working with objects and functions.

`useStableReference` allows you to use a stable reference which you can safely pass into your `useEffect`/`useMemo`/`useCallback` dependency arrays - without worrying about endless rerenders because of new object references being created.

# Usage

`npm install use-stable-reference`

Contrived example:

```tsx
import { useStableReference } from "use-stable-reference";

const MyComponent = (props) => {
  // Keep a stable reference
  const user = useStableReference(props.user);

  // Do something that should only happen when the _value_ of user changes
  useEffect(() => {
    sendTrackingEvent(user, "some event");
  }, [user]);

  // Use whatever you want in the output
  return <p>Hello, {props.user.id}</p>;
};
```

You can also use `useStableReference` for storing function references, but if your function references variables from the closure, you must also provide said variables as dependencies:

```tsx
const MyComp = (props) => {
  // First we need to "stabilize" the user object reference
  const user = useStableReference(props.user);

  // Next, we can store a reference to the function,
  // and list the user variable as a dependency
  const trackUser = useStableReference(
    () => sendTrackingEvent(props.user, "some event"),
    [user]
  );

  // Will only run if the value of the user object changes
  useEffect(() => {
    trackUser();
  }, [trackUser]);

  // Use whatever you want in the output
  return <p>Hello, {props.user.id}</p>;
};
```
