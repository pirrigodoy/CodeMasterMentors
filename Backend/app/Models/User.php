<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // Importar la interfaz JWTSubject
use Laravel\Sanctum\HasApiTokens;
use App\Models\Role;
use App\Models\City;


class User extends Authenticatable implements JWTSubject // Implementar la interfaz JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'username',
        'password',
        'name',
        'email',
        'born_date',
        'city_id',
        'img'

    ];

    protected $guarded = [
        'id',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $primaryKey = 'id';

    public function getRouteKeyName()
    {
        return 'id';
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    // Métodos de la interfaz JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
