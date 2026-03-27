<?php

namespace App\Events;

use App\Models\LiveChatMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LiveChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public LiveChatMessage $chatMessage,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("live-chat.{$this->chatMessage->user_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->chatMessage->id,
            'user_id' => $this->chatMessage->user_id,
            'sender_type' => $this->chatMessage->sender_type,
            'message' => $this->chatMessage->message,
            'created_at' => optional($this->chatMessage->created_at)->toIso8601String(),
        ];
    }
}
