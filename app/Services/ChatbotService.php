<?php

namespace App\Services;

class ChatbotService
{
    public function reply(string $message): string
    {
        $normalized = mb_strtolower(trim($message));

        if (str_contains($normalized, 'shipping')) {
            return 'Shipping is complimentary for this release and usually arrives in 2-4 business days.';
        }

        if (str_contains($normalized, 'return') || str_contains($normalized, 'refund')) {
            return 'Returns are accepted within 30 days in original condition. Refunds are processed after quality check.';
        }

        if (str_contains($normalized, 'status') || str_contains($normalized, 'order')) {
            return 'You can track your order in the Orders page. If you share your order number, our team can assist faster.';
        }

        if (str_contains($normalized, 'size')) {
            return 'For sizing, check product detail pages and use your regular fit as baseline. We can recommend by item.';
        }

        return 'Thanks for your message. I can help with shipping, returns, order status, and sizing guidance.';
    }
}
