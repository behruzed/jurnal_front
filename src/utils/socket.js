import { io } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL;
const SOCKET_URL = apiUrl ? apiUrl.replace('/api', '') : undefined;

export const socket = SOCKET_URL
  ? io(SOCKET_URL, { autoConnect: false })
  : io({ autoConnect: false });
