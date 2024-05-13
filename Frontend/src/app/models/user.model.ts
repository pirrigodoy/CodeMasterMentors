import { Role } from './role.model';

export class User {
  id: number;
  role_id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  born_date: string;
  city: string;
  img: string;
  created_at: string;
  updated_at: string;
  role?: Role | null;
  // Aquí asumo que tienes una clase Role en Angular que refleja la estructura de tu modelo Role en Laravel

  constructor(
    id: number,
    role_id: number,
    username: string,
    password: string,
    name: string,
    email: string,
    born_date: string,
    city: string,
    img: string,
    created_at: string,
    updated_at: string,
    role: Role
  ) {
    this.id = id;
    this.role_id = role_id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.email = email;
    this.born_date = born_date;
    this.city = city;
    this.img = img;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.role = role;
  }
}
