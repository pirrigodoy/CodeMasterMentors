export class TeacherProgramming {
  id: number;
  user_id: number;
  programming_language_id: number;
  created_at: string;
  updated_at: string;

  constructor(
    id: number,
    user_id: number,
    programming_language_id: number,
    created_at: string,
    updated_at: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.programming_language_id = programming_language_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
