<?php

namespace App\Http\Controllers\Shop;

use App\Events\LiveChatMessageSent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\StoreLiveChatMessageRequest;
use App\Models\LiveChatMessage;
use App\Services\ChatbotService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LiveChatController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        abort_unless($user !== null, 403);

        $messages = LiveChatMessage::query()
            ->where('user_id', $user->id)
            ->orderBy('id')
            ->limit(100)
            ->get()
            ->map(fn (LiveChatMessage $message): array => [
                'id' => $message->id,
                'user_id' => $message->user_id,
                'sender_type' => $message->sender_type,
                'message' => $message->message,
                'created_at' => optional($message->created_at)->toIso8601String(),
            ])
            ->values()
            ->all();

        return Inertia::render('Shop/LiveChat', [
            'messages' => $messages,
        ]);
    }

    public function store(
        StoreLiveChatMessageRequest $request,
        ChatbotService $chatbotService,
    ): RedirectResponse {
        $user = $request->user();

        abort_unless($user !== null, 403);

        $userMessage = LiveChatMessage::query()->create([
            'user_id' => $user->id,
            'sender_type' => LiveChatMessage::SENDER_USER,
            'message' => $request->validated('message'),
        ]);

        broadcast(new LiveChatMessageSent($userMessage));

        $botMessage = LiveChatMessage::query()->create([
            'user_id' => $user->id,
            'sender_type' => LiveChatMessage::SENDER_BOT,
            'message' => $chatbotService->reply($userMessage->message),
            'meta' => ['source' => 'rule-based'],
        ]);

        broadcast(new LiveChatMessageSent($botMessage));

        return back();
    }
}
