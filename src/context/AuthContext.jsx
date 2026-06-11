import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const unsubscribeRef = useRef(null);
  const initPromiseRef = useRef(null);

  const initializeAuth = useCallback(() => {
    if (authReady) return Promise.resolve();
    if (initPromiseRef.current) return initPromiseRef.current;

    setLoading(true);

    initPromiseRef.current = Promise.all([
      import("./../firebase/firebase.config"),
      import("firebase/auth"),
    ]).then(([{ auth }, { onAuthStateChanged }]) => {
      unsubscribeRef.current = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
        setLoading(false);
      });
    });

    return initPromiseRef.current;
  }, [authReady]);

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authReady, initializeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
