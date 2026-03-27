<?php

namespace Tests\Feature;

use App\Models\LiveChatMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LiveChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_live_chat_requires_authentication(): void
    {
        $this->get(route('live-chat.index'))
            ->assertRedirect(route('login'));
    }

    public function test_user_can_send_message_and_receive_bot_reply(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('live-chat.store'), [
                'message' => 'What is your shipping policy?',
            ])
            ->assertRedirect();

        $messages = LiveChatMessage::query()
            ->where('user_id', $user->id)
            ->orderBy('id')
            ->get();

        $this->assertCount(2, $messages);
        $this->assertSame(LiveChatMessage::SENDER_USER, $messages[0]->sender_type);
        $this->assertSame(LiveChatMessage::SENDER_BOT, $messages[1]->sender_type);
        $this->assertStringContainsString('Shipping', $messages[1]->message);
    }
}
