<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Teacher;
use App\Models\ProgrammingLanguage;


class TeacherProgramming extends Model
{
    use HasFactory;
    protected $fillable = [
        'teacher_id',
        'programmingLanguage_id'

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

    public function programmingLanguage(){
        return $this->belongsTo(ProgrammingLanguage::class);
    }
}
