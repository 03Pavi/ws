interface User {
    id: string;
    name: string;
  }
  
  interface UpdateOnlineUsersPayload {
    users: User[];
    selectedUser: string | null;
  }
  