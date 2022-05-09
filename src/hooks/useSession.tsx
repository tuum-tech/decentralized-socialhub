import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSession } from 'src/store/users/selectors';
import { setSession as setSessionAction } from 'src/store/users/actions';

const useSession = () => {
  const dispatch = useDispatch();
  const session = useSelector((state: any) => selectSession(state));
  const setSession = useCallback(
    (value: ISessionItem) => dispatch(setSessionAction({ session: value })),
    [dispatch]
  );

  return { session, setSession };
};

export default useSession;
