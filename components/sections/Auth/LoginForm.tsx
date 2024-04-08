/* eslint-disable no-case-declarations */
import { useEffect, useState } from 'react';

import {
  AuthUser,
  getCurrentUser,
  signInWithRedirect,
  signOut,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

const LoginForm = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          console.log(payload.event);
          // getUser();
          break;
        case 'signInWithRedirect_failure':
          setError('An error has occurred during the Oauth flow.');
          break;
        case 'customOAuthState':
          setCustomState(payload.data);
          break;
      }
    });

    // getUser();

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error(error);
      console.log('Not signed in');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={() => signInWithRedirect()}>Open Hosted UI</button>
      <button onClick={() => signOut()}>Sign Out</button>
      <div>{user?.username}</div>
    </div>
  );
};

export default LoginForm;
