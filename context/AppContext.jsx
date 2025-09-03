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
  const [selectedChat, setSelectedChat] = useState({ messages: [] });
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = async () => {
    if (isCreatingChat) return;
    setIsCreatingChat(true);
    try {
      if (!user) return null;
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUserschats();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const fetchUserschats = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success && Array.isArray(data.data)) {
        setChats(data.data);

        if (data.data.length === 0) {
          if (!isCreatingChat) {
            await createNewChat();
          }
          return;
        } else {
          data.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          setSelectedChat({ ...data.data[0], messages: data.data[0].messages || [] });
        }
      } else {
        toast.error("Failed to fetch chats: Invalid response");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserschats();
    }
  }, [user, fetchUserschats]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUserschats,
    createNewChat,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};