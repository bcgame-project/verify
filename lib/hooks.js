
function useMountedState() {
  const mountedRef = React.useRef(false);
  const get = React.useCallback(() => mountedRef.current, []);

  React.useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}

function useSetState (
  initialState
) {
  const [state, set] = React.useState(initialState);
  const isMounted = useMountedState();
  const setState = React.useCallback(
    (patch) => {
      if (isMounted()) {
        set((prevState) => {
          const newState = patch instanceof Function ? patch(prevState) : patch;
          const needUpdate =
            Object.keys(newState).findIndex(
              (it) => prevState[it] !== newState[it]
            ) != -1;
          if (!needUpdate) return prevState;
          return Object.assign({}, prevState, newState);
        });
      }
    },
    [set]
  );

  return [state, setState];
}

window.hooks = {
  useMountedState,
  useSetState
}

