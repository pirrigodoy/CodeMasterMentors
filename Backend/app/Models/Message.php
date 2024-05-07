<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'remitente',
        'destinatario',
        'content',
        'date',
        'estado'
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

    public function state()
    {
        return $this->belongsTo(State::class);
    }
}
