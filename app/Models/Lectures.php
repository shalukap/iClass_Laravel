<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lectures extends Model
{
    use HasFactory;

    protected $primaryKey = 'lid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'lid',
        'lec_name',
        'lec_address',
        'lec_dob',
        'qualification',
        'tp_no',
        'whatsapp_no',
        'lec_email',
        'status',
        'is_employed',
        'school_id',
        'bank_account',
        'bank_name',
        'bank_branch',
        'vehicle_no',
    ];
    protected $casts = [
        'lid' => 'string',
        'lec_name' => 'string',
        'lec_address' => 'string',
        'lec_dob' => 'date',
        'qualification' => 'string',
        'tp_no' => 'string',
        'whatsapp_no' => 'string',
        'lec_email' => 'string',
        'status' => 'boolean',
        'is_employed' => 'boolean',
    ];

    public static function rules($isUpdate = false)
    {
        $rules = [
            'lec_name' => 'required|string|max:255',
            'lec_address' => 'required|string|max:255',
            'lec_dob' => 'required|date',
            'qualification' => 'required|string',
            'tp_no' => 'required|string|digits:10|regex:/^[0-9]{10}$/',
            'whatsapp_no' => 'required|string|digits:10|regex:/^[0-9]{10}$/',
            'lec_email' => 'required|email|max:255',
            'status' => 'boolean',
            'is_employed' => 'boolean',
            'school_id' => 'nullable|required_if:is_employed,true|exists:schools,schoolId',
            'bank_account' => 'nullable|string|regex:/^[0-9]+$/',
            'bank_name' => 'nullable|string|max:50',
            'bank_branch' => 'nullable|string|max:50',
            'vehicle_no' => 'nullable|string|max:20',
        ];

        return $rules;
    }

    public function classes()
    {
        return $this->belongsToMany(
            Classes::class,
            'lecture_class',
            'lid',
            'cid'
        )
            ->withTimestamps();
    }

    public function payments()
    {
        return $this->hasMany(LecturePayment::class, 'lid', 'lid');
    }

    public function school()
    {
        return $this->belongsTo(Schools::class, 'school_id', 'schoolId');
    }
}
