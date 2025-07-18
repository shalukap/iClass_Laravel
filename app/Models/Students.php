<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    protected $fillable = ['sid','name', 'image', 'address', 'age', 'dob','gender','school','parent','phone','watsapp','status'];
}
