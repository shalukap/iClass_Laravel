<?php

namespace App\Http\Controllers;

use App\Models\StudentPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function collectionReport(Request $request)
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());

        $collections = StudentPayment::with(['student', 'class'])
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->orderBy('payment_date', 'desc')
            ->get();

        $deletedCollections = StudentPayment::onlyTrashed()
            ->with(['student', 'class'])
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->orderBy('deleted_at', 'desc')
            ->get();

        $summary = [
            'total_amount' => $collections->sum('amount'),
            'total_count' => $collections->count(),
            'deleted_amount' => $deletedCollections->sum('amount'),
            'deleted_count' => $deletedCollections->count(),
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'collections' => $collections,
                'deleted_collections' => $deletedCollections,
                'summary' => $summary
            ]);
        }

        return Inertia::render('reports/collection', [
            'collections' => $collections,
            'deleted_collections' => $deletedCollections,
            'summary' => $summary
        ]);
    }

    public function exportCollectionPdf(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        if (!$startDate || !$endDate) {
            return back()->with('error', 'Please select a date range.');
        }

        $collections = StudentPayment::with(['student', 'class'])
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->orderBy('payment_date', 'asc')
            ->get();

        $deletedCollections = StudentPayment::onlyTrashed()
            ->with(['student', 'class'])
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->orderBy('deleted_at', 'asc')
            ->get();

        $total = $collections->sum('amount');
        $deletedTotal = $deletedCollections->sum('amount');

        $pdf = Pdf::loadView('reports.collection_pdf', compact('collections', 'deletedCollections', 'startDate', 'endDate', 'total', 'deletedTotal'));
        
        return $pdf->download("collection_report_{$startDate}_to_{$endDate}.pdf");
    }
}
