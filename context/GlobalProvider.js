import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getBookmarks, addBookmark } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsLoggedIn(true);
          setUser(currentUser);
          const userBookmarks = await getBookmarks(currentUser.$id);
          setBookmarks(userBookmarks);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleAddBookmark = async (postId) => {
    if (user) {
      try {
        await addBookmark(user.$id, postId);
        const updatedBookmarks = await getBookmarks(user.$id);
        setBookmarks(updatedBookmarks);
      } catch (error) {
        console.error("Failed to add bookmark", error);
      }
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        bookmarks,
        handleAddBookmark
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;