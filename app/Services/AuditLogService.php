<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogService
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function record(
        string $event,
        ?int $actorId = null,
        ?string $entityType = null,
        ?int $entityId = null,
        array $context = [],
        ?Request $request = null,
    ): void {
        AuditLog::query()->create([
            'actor_id' => $actorId,
            'event' => $event,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'context' => $context,
        ]);
    }
}
