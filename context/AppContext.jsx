"use client";
import axios from "axios"; 
import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const createNewChat = async () => {
    try {
      if (!user) return null;
      const token = await getToken();

      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUserschats(); // ✅ added await to avoid race conditions
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const fetchUserschats = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        console.log(data.data);
        setChats(data.data);

        if (data.data.length === 0) {
          await createNewChat();
          return;
        } else {
          // sort chats by last update
          data.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          setSelectedChat(data.data[0]);
          console.log(data.data[0]);
        }
      } else {
        toast.error("Failed to fetch chats");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserschats();
    }
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUserschats,
    createNewChat,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
