<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    protected $primaryKey = 'sid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['sid', 'sname', 'image', 'address', 'age', 'dob', 'gender', 'schoolId', 'parentName', 'tpNo', 'watsapp', 'isActive'];

    public function classes()
    {
        return $this->belongsToMany(Classes::class, 'class_student', 'sid', 'cid')
            ->withPivot('due_amount');
    }
    public function getRouteKeyName(): string
    {
        return 'sid';
    }
    public function payments()
    {
        return $this->hasMany(StudentPayment::class, 'sid', 'sid');
    }

    public function schoolDetails()
    {
        return $this->belongsTo(Schools::class, 'schoolId', 'schoolId');
    }

}
