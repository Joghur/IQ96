export type User = {
  id?: string;
  isAdmin: boolean;
  isBoard: boolean;
  isSuperAdmin: boolean;
  name: string;
  nick: string;
  title: string;
  avatar?: string;
  firebaseId: string;
};
