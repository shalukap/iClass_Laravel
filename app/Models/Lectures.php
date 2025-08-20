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
}
