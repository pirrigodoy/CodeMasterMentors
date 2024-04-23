export class Comment {
  id: number;
  user_id: number;
  rating: number;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;

  constructor(
    id: number,
    user_id: number,
    rating: number,
    content: string,
    date: string,
    created_at: string,
    updated_at: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.rating = rating;
    this.content = content;
    this.date = date;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
