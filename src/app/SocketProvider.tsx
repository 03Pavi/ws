// components/SocketProvider.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSocketId } from "@/features/socket/model/socketSlice";
import { io } from "socket.io-client";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const socket = io("http://localhost:3000");

  useEffect(() => {
    dispatch(setSocketId(socket.id as string));

    return () => {
      socket.disconnect();
    };
  }, [dispatch, socket]);

  return <>{children}</>;
};

export default SocketProvider;
