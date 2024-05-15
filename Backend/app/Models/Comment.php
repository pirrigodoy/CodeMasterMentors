<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Advertisement;


class Comment extends Model
{
    use HasFactory;
    protected $fillable = [
        'advertisement_id',
        'transmitter',
        'receiver',
        'rating',
        'comment',
        'date'
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
    public function advertisement(){
        return $this->belongsTo(Advertisement::class);
    }

}
