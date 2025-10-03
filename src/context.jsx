import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./db/superbase";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // optional: fetch user once on mount
  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); // initial fetch

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth event:", _event, session); // debug
      if (session?.user) setUser(session.user);
      else setUser(null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  return (
    <UrlContext.Provider value={{ user, loading, fetchUser, isAuthenticated }}>
      {children}
    </UrlContext.Provider>
  );
};

export const urlState = () => useContext(UrlContext);
export default UrlProvider;
