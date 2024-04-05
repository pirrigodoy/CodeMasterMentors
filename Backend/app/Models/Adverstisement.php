<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Teacher;

class Adverstisement extends Model
{
    use HasFactory;
    protected $fillable = [
        'teacher_id',
        'title',
        'place',
        'about_me',
        'description'

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

    public function teacher(){
        return $this->belongsTo(Teacher::class);
    }
}
