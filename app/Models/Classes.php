<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $primaryKey = 'cid';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name', 'time_start', 'time_end', 'grade', 'classroom_id', 'lid', 'fee'
    ];

    protected $attributes = [
        'fee' => 2000.00
    ];
    protected $casts = [
        'fee' => 'float',
    ];

    // Relationship to Classroom
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id', 'classroomId');
    }

    // Relationship to Lecture
    public function lecturer()
    {
        return $this->belongsTo(Lectures::class, 'lid', 'lid');
    }
}
