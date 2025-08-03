<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $table = 'classrooms';

    protected $primaryKey = 'classroomId';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'classroomId',
        'name',
    ];


    public function classes()
    {
        return $this->hasMany(Classes::class, 'classroom_id', 'classroomId');
    }
}
