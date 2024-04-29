<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Advertisement;
use App\Models\FavouriteList;


class TeacherFavouriteList extends Model
{
    use HasFactory;
    protected $fillable = [
        'advertisement_id',
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

    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }

    public function favouriteList()
    {
        return $this->belongsTo(FavouriteList::class);
    }
}
