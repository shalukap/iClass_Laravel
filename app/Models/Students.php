<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class Students extends Model
{
    protected $primaryKey = 'sid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['sid', 'sname', 'image', 'address', 'age', 'dob', 'gender', 'schoolId', 'parentName', 'tpNo', 'watsapp', 'isActive'];

    public static function rules($isUpdate = false)
{
    $rules = [
        'tpNo' => ['required', 'digits:10'],
        'watsapp' => ['required', 'digits:10'],
        'sname' => 'required|string|max:255',
        'gender' => 'required|in:male,female',
        'address' => 'required|string',
        'dob' => 'required|date',
        'school' => 'required|exists:schools,schoolId', // ✅ match frontend field
        'parentName' => 'required|string|max:255',
        'isActive' => 'boolean',
    ];

    if (!$isUpdate) {
        $rules['image'] = 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048';
    }

    return $rules;
}


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
