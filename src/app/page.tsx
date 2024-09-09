"use client";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import {
  setIsConnected,
  setTransport,
  setSocketId,
} from "@/features/socket/model/socketSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Chip,
  Paper,
  IconButton,
} from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";

export default function Home() {
  const dispatch = useAppDispatch();
  const { isConnected, transport, socketId } = useAppSelector(
    (state) => state.socket
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; date: string; time: string; socketId: string }[]
  >([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");
    const socket = socketRef.current;

    if (socket) {
      socket.on("connect", () => {
        dispatch(setIsConnected(true));
        dispatch(setTransport(socket.io.engine.transport.name));
        dispatch(setSocketId(socket.id as string));
      });

      socket.on("upgrade", (transport: any) => {
        dispatch(setTransport(transport.name));
      });

      socket.on("chat message", (msg: { text: string; socketId: string }) => {
        const now = dayjs();
        const date = now.format("YYYY-MM-DD");
        const time = now.format("HH:mm:ss");
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...msg, date, time },
        ]);
      });

      socket.on("disconnect", () => {
        dispatch(setIsConnected(false));
        dispatch(setTransport("N/A"));
        dispatch(setSocketId(null));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("upgrade");
        socketRef.current.off("chat message");
        socketRef.current.off("disconnect");
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      socketRef.current.emit("chat message", {
        text: message,
        socketId: socketId,
      });
      setMessage("");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Message copied to clipboard!"))
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" p={3}>
      <Box>
        <Typography variant="h6">
          Status: {isConnected ? "connected" : "disconnected"}
        </Typography>
        <Typography variant="subtitle1">Transport: {transport}</Typography>
      </Box>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        mt={2}
        mb={2}
        p={2}
        border={1}
        borderColor="divider"
        borderRadius={1}
        overflow="auto"
      >
        <Typography variant="h4">Chat</Typography>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          overflow="auto"
          mb={2}
        >
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    msg.socketId === socketId ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    padding: 1,
                    borderRadius: 1,
                    maxWidth: "80%",
                    backgroundColor:
                      msg.socketId === socketId
                        ? "primary.main"
                        : "background.paper",
                    color:
                      msg.socketId === socketId
                        ? "primary.contrastText"
                        : "text.primary",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    position: "relative",
                  }}
                >
                  <Box>
                    <Chip label={msg.date} color="default" size="small" />
                    <Chip label={msg.time} color="default" size="small" />
                  </Box>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {msg.text}
                  </Typography>
                  <IconButton
                    onClick={() => handleCopy(msg.text)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <CopyAllIcon />
                  </IconButton>
                </Paper>
              </ListItem>
            ))}
          </List>
          <div ref={chatEndRef} /> {/* Dummy element to scroll to */}
        </Box>
        <form onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
