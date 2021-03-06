import React from 'react';
import firebase from '../../firebase';

function useAuth() {
  const [authUser, setAuthUser] = React.useState(null);
  React.useEffect(() => {
    const unSubscribe = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => unSubscribe();
  }, []);

  return authUser;
}

export default useAuth;
