<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('live-chat.{userId}', function ($user, $userId) {
    return $user && ((int) $user->id === (int) $userId || (bool) $user->is_admin);
});
