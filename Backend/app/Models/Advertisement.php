<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\ProgrammingLanguage;


class Advertisement extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'programmingLanguage_id',
        'title',
        'class',
        'about_me',
        'description',
        'price_hour',
        'disponibility',
        'experience'

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

    public function programmingLanguage()
    {
        return $this->belongsTo(ProgrammingLanguage::class);
    }
}
