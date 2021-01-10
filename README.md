# useStableReference

Dependency arrays in React can be hard to deal with when you're working with objects and functions.

`useStableReference` allows you to use a stable reference which you can safely pass into your `useEffect`/`useMemo`/`useCallback` dependency arrays - without worrying about endless rerenders because of new object references being created.

This is because `useStableReference` will only update its result if the _value_ of the input changes, rather than the reference.

# Usage

`npm install use-stable-reference`

Contrived example:

```tsx
import { useStableReference } from "use-stable-reference";

type Props = {
  person: {
    name: string;
  };
};

const MyComponent = (props: Props) => {
  const stablePersonReference = useStableReference(props.person);

  useEffect(() => {
    console.log(`Name: ${stablePersonReference.name}`);
  }, [stablePersonReference]);

  return <p>Hello, {props.person}</p>;
};
```
