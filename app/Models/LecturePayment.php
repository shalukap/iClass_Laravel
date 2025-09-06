<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LecturePayment extends Model
{
    use HasFactory;

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
        'payment_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the lecture associated with this payment.
     */
    public function lecture()
    {
        return $this->belongsTo(Lectures::class, 'lid', 'lid');
    }

    /**
     * Get the class associated with this payment.
     */
    public function class()
    {
        return $this->belongsTo(Classes::class, 'cid', 'cid');
    }
}
