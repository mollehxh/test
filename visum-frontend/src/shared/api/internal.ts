import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost/api';

interface User {
  id: number;
  email: string;
  username: string;
}

interface Room {
  room_id: number;
  creator_id: number;
  video_url: string;
}

interface RoomMember {
  member_id: number;
  room_id: number;
  user_id: number;
}

interface Message {
  message_id: number;
  user_id: number;
  message_text: string;
}

interface RoomMessage {
  room_message_id: number;
  room_id: number;
  message_id: number;
}

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<string> => {
  const response: AxiosResponse<string> = await axios.post(
    `${API_URL}/users`,
    userData
  );
  return response.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<string> => {
  const response: AxiosResponse<string> = await axios.post(
    `${API_URL}/users/login`,
    credentials
  );

  return response.data;
};

export const createRoom = async (roomData: {
  creator_id: number;
  video_url: string;
}): Promise<Room> => {
  const response: AxiosResponse<Room> = await axios.post(
    `${API_URL}/rooms`,
    roomData
  );
  return response.data;
};

export const getAllRooms = async (): Promise<Room[]> => {
  const response: AxiosResponse<Room[]> = await axios.get(`${API_URL}/rooms`);
  return response.data;
};

export const createRoomMember = async (memberData: {
  room_id: number;
  user_id: number;
}): Promise<RoomMember> => {
  const response: AxiosResponse<RoomMember> = await axios.post(
    `${API_URL}/room-members`,
    memberData
  );
  return response.data;
};

export const createMessage = async (messageData: {
  user_id: number;
  message_text: string;
}): Promise<Message> => {
  const response: AxiosResponse<Message> = await axios.post(
    `${API_URL}/messages`,
    messageData
  );
  return response.data;
};

export const getAllRoomMessages = async (
  roomId: number
): Promise<RoomMessage[]> => {
  const response: AxiosResponse<RoomMessage[]> = await axios.get(
    `${API_URL}/rooms/${roomId}/messages`
  );
  const roomMessages = response.data;

  return roomMessages;
};

export const getUsersInRoom = async (roomId: string): Promise<User[]> => {
  const response: AxiosResponse<User[]> = await axios.get(
    `${API_URL}/rooms/${roomId}/users`
  );
  return response.data;
};

export const getSession = async (email: string | null) => {
  const response = await axios.post(`${API_URL}/session`, {
    email,
  });
  return response.data;
};

export const getVideoUrlByRoomId = async (roomId: string) => {
  const response = await axios.post(`${API_URL}/get-url`, {
    roomId,
  });
  return response.data;
};
