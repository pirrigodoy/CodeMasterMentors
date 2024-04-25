import { FavouriteList } from './favourite-list.model';

export class TeacherFavouriteList {
  id: number;
  user_id: number;
  favourite_list_id: number;
  created_at: string;
  updated_at: string;
  favouriteList: FavouriteList;

  constructor(
    id: number,
    user_id: number,
    favourite_list_id: number,
    created_at: string,
    updated_at: string,
    favouriteList: FavouriteList
  ) {
    this.id = id;
    this.user_id = user_id;
    this.favourite_list_id = favourite_list_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.favouriteList = favouriteList;
  }
}
