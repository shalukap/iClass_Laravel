<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Collection Report</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            color: #4f46e5;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
        }
        .summary {
            margin-bottom: 20px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
        }
        .summary table {
            width: 100%;
        }
        .summary td {
            padding: 5px 0;
        }
        .summary .label {
            font-weight: bold;
            color: #64748b;
        }
        .summary .value {
            font-weight: bold;
            font-size: 14px;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.data th {
            background: #4f46e5;
            color: white;
            text-align: left;
            padding: 10px;
            font-weight: bold;
        }
        table.data td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        table.data tr:nth-child(even) {
            background: #f1f5f9;
        }
        .total-row {
            font-weight: bold;
            background: #e2e8f0 !important;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Daily Collection Report</h1>
        <p>iClass Management System</p>
    </div>

    <div class="summary">
        <table>
            <tr>
                <td width="50%">
                    <span class="label">Date Range:</span><br>
                    <span class="value">{{ \Carbon\Carbon::parse($startDate)->format('d M Y') }} - {{ \Carbon\Carbon::parse($endDate)->format('d M Y') }}</span>
                </td>
                <td width="50%" align="right">
                    <span class="label">Total Collected:</span><br>
                    <span class="value" style="color: #10b981;">Rs. {{ number_format($total, 2) }}</span>
                </td>
            </tr>
        </table>
    </div>

    <table class="data">
        <thead>
            <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Class</th>
                <th>Period</th>
                <th align="right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($collections as $pay)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($pay->payment_date)->format('d/m/Y') }}</td>
                    <td>{{ $pay->student->sname ?? 'Unknown' }} ({{ $pay->sid }})</td>
                    <td>{{ $pay->class->name ?? 'N/A' }}</td>
                    <td>{{ $pay->month }}/{{ $pay->year }}</td>
                    <td align="right">Rs. {{ number_format($pay->amount, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="4" align="right">Grand Total:</td>
                <td align="right">Rs. {{ number_format($total, 2) }}</td>
            </tr>
        </tbody>
    </table>

    @if($deletedCollections->count() > 0)
    <div class="header" style="margin-top: 40px; border-bottom: 2px solid #ef4444;">
        <h1 style="color: #ef4444;">Deleted Receipts</h1>
    </div>

    <table class="data">
        <thead>
            <tr style="background: #ef4444;">
                <th style="background: #ef4444;">Date</th>
                <th style="background: #ef4444;">Student</th>
                <th style="background: #ef4444;">Class</th>
                <th style="background: #ef4444;">Reason</th>
                <th style="background: #ef4444;" align="right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($deletedCollections as $pay)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($pay->payment_date)->format('d/m/Y') }}</td>
                    <td>{{ $pay->student->sname ?? 'Unknown' }}</td>
                    <td>{{ $pay->class->name ?? 'N/A' }}</td>
                    <td>{{ $pay->delete_reason ?? 'N/A' }}</td>
                    <td align="right" style="color: #ef4444;">Rs. {{ number_format($pay->amount, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row" style="background: #fee2e2 !important;">
                <td colspan="4" align="right">Total Deleted:</td>
                <td align="right" style="color: #ef4444;">Rs. {{ number_format($deletedTotal, 2) }}</td>
            </tr>
        </tbody>
    </table>
    @endif

    <div class="footer">
        Generated on {{ now()->format('d M Y, h:i A') }}
    </div>
</body>
</html>
