import { useState, useEffect, useCallback, createContext } from 'react';

const AuthContext = createContext({
  token: '',
  login: () => {},
  logout: () => {},
  userId: null
});

let logoutTimer;

const calculateRemainingTime = (exp) => {
  const currentTime = new Date().getTime();
  const expTime = new Date(exp).getTime();
  const remainingTime = expTime - currentTime;
  return remainingTime;
};

const getLocalData = () => {
  const storedToken = localStorage.getItem('token');
  const storedExp = localStorage.getItem('exp');

  const remainingTime = calculateRemainingTime(storedExp);

  if (remainingTime <= 1000 * 60 * 30) {
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const localData = getLocalData();

  let initialToken;
  if (localData) {
    initialToken = localData.token;
  }

  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(null);

  const logout = useCallback(() => {
    setToken('');
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
    clearTimeout(logoutTimer);
  }, []);

  const login = useCallback((token, exp, userId) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem('token', token);
    localStorage.setItem('exp', exp);

    const remainingTime = calculateRemainingTime(exp);

    logoutTimer = setTimeout(logout, remainingTime);
  }, [logout]);

  const logoutHandler = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

  useEffect(() => {
    if (localData) {
      logoutTimer = setTimeout(logout, localData.duration);
    }
  }, [localData, logout]);

  const contextValue = {
    token,
    login,
    logout,
    userId,
    logoutHandler
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
