<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Teacher;
use App\Models\FavouriteList;


class TeacherFavouriteList extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'user_id',
        'favourite_list_id',
    ];
    protected $guarded = [
        'id',
        'created_at',
        'updated_at'
    ];
    protected $primaryKey = 'id';

    public function getRouteKeyName()
    {
        return 'id';
    }

    // public function teacher()
    // {
    //     return $this->belongsTo(Teacher::class);
    // }

    public function favouriteList(){
        return $this->belongsTo(FavouriteList::class);
    }
}
