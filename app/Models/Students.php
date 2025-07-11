<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    protected $fillable = ['sid','sname', 'image', 'address', 'age', 'dob','gender','school','parentName','tpNo','watsapp','isActive'];
}
