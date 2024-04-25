export class Message {
  id: number;
  user_id: number;
  content: string;
  date: string;
  status: string;
  created_at: string;
  updated_at: string;

  constructor(
    id: number,
    user_id: number,
    content: string,
    date: string,
    status: string,
    created_at: string,
    updated_at: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.content = content;
    this.date = date;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
