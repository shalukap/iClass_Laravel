<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schools extends Model
{
    protected $table = 'schools';
    protected $primaryKey = 'schoolId';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['schoolId', 'name'];
    public function students()
    {
        return $this->hasMany(Students::class, 'schoolId', 'schoolId');
    }

}

