<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiveChatMessage extends Model
{
    public const SENDER_USER = 'user';

    public const SENDER_BOT = 'bot';

    public const SENDER_AGENT = 'agent';

    protected $fillable = [
        'user_id',
        'sender_type',
        'message',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'meta' => 'array',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
