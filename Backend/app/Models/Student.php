<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Role;


class Student extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'course',
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
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
