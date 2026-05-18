<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json(['users' => $users]);
        }

        return view('app');
    }

    public function create()
    {
        return view('app');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'user_type' => ['required', Rule::in(['receptionist', 'admin', 'root'])],
            'status' => ['required', Rule::in(['active', 'deactive'])],
            'privileges' => ['nullable', 'array'],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'User created successfully', 'user' => $user]);
        }

        return redirect()->route('users.index');
    }

    public function edit(User $user)
    {
        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json([
                'user' => $user,
                'isEdit' => true
            ]);
        }

        return view('app');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'user_type' => ['required', Rule::in(['receptionist', 'admin', 'root'])],
            'status' => ['required', Rule::in(['active', 'deactive'])],
            'privileges' => ['nullable', 'array'],
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'User updated successfully', 'user' => $user]);
        }

        return redirect()->route('users.index');
    }

    public function destroy(User $user)
    {
        $user->delete();

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json(['message' => 'User deleted successfully']);
        }

        return redirect()->route('users.index');
    }
}
