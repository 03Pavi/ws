// src/features/socket/socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  isConnected: boolean;
  transport: string;
  socketId: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  transport: 'N/A',
  socketId: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setTransport(state, action: PayloadAction<string>) {
      state.transport = action.payload;
    },
    setSocketId(state, action: PayloadAction<string | null>) {
      state.socketId = action.payload;
    },
  },
});

export const { setIsConnected, setTransport, setSocketId } = socketSlice.actions;

export default socketSlice.reducer;
