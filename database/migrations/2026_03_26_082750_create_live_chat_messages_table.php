<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('sender_type', 20);
            $table->text('message');
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'id']);
            $table->index('sender_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('live_chat_messages');
    }
};
