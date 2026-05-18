<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentPayment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'student_payments';
    protected $primaryKey = 'pid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'pid', 'sid', 'cid', 'year', 'month', 'amount', 'payment_date', 'delete_reason'
    ];
    protected $casts = [
        'pid' => 'string',
        'sid' => 'string',
        'cid' => 'string',
        'year' => 'integer',
        'month' => 'integer',
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

public function student()
{

    return $this->belongsTo(Students::class, 'sid', 'sid')->withDefault([
        'sname' => 'Unknown Student'
    ]);
}


public function class()
{
    return $this->belongsTo(Classes::class, 'cid', 'cid');
}
}
