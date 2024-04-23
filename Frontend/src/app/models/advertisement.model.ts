import { User } from './user.model';
import { ProgrammingLanguage } from './programming-laguage.model';

export class Advertisement {
  id: number;
  user_id: number;
  programming_language_id: number;
  title: string;
  classType: string; // Cambio de 'class' a 'classType'
  about_me: string;
  description: string;
  price_hour: number;
  disponibility: string;
  experience: string;
  created_at: string;
  updated_at: string;
  user: User;
  programmingLanguage: ProgrammingLanguage;

  constructor(
    id: number,
    user_id: number,
    programming_language_id: number,
    title: string,
    classType: string,
    about_me: string,
    description: string,
    price_hour: number,
    disponibility: string,
    experience: string,
    created_at: string,
    updated_at: string,
    user: User,
    programmingLanguage: ProgrammingLanguage
  ) {
    this.id = id;
    this.user_id = user_id;
    this.programming_language_id = programming_language_id;
    this.title = title;
    this.classType = classType; // Cambio de 'class' a 'classType'
    this.about_me = about_me;
    this.description = description;
    this.price_hour = price_hour;
    this.disponibility = disponibility;
    this.experience = experience;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.user = user;
    this.programmingLanguage = programmingLanguage;
  }
}
