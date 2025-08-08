<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LecturePayment extends Model
{
    use HasFactory;

    protected $table = 'lecture_payments';
    protected $primaryKey = 'lpid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'lpid',
        'lid',
        'cid',
        'year',
        'month',
        'amount',
        'payment_date',
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'amount' => 'float',
        'payment_date' => 'date',
    ];

    public function lectures()
    {
        return $this->belongsTo(Lectures::class, 'lid', 'lid');
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'cid', 'cid');
    }
}
