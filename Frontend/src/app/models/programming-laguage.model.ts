export class ProgrammingLanguage {
  id: number;
  languageName: string;
  created_at: string;
  updated_at: string;

  constructor(
    id: number,
    languageName: string,
    created_at: string,
    updated_at: string
  ) {
    this.id = id;
    this.languageName = languageName;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
