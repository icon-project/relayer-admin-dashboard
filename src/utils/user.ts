import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const usersFilePath = process.env.NEXT_USERS_FILE || path.join(process.cwd(), 'users.json');

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  company: string;
  designation: string;
}

export async function readUsers(): Promise<User[]> {
  const data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
}

export async function addUser(user: User): Promise<User> {
  const users = await readUsers();
  const id = crypto.randomUUID();
  users.push({ ...user, id });
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  return user;
}

export async function updateUser(user: User): Promise<User> {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    return user;
  } else {
    throw new Error('User not found');
  }
}

export async function deleteUser(id: string): Promise<void> {
  const users = await readUsers();
  const filteredUsers = users.filter((u) => u.id !== id);
  if (filteredUsers.length === users.length) {
    throw new Error('User not found');
  }
  fs.writeFileSync(usersFilePath, JSON.stringify(filteredUsers, null, 2), 'utf8');
}

export async function getUserById(id: string): Promise<User> {
  const users = await readUsers();
  const user = users.find((u) => u.id === id);
  if (user) {
    return user;
  } else {
    throw new Error('User not found');
  }
}