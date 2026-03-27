import type Echo from 'laravel-echo';
import type Pusher from 'pusher-js';

declare global {
    interface Window {
        axios: typeof import('axios').default;
        Echo: Echo<'reverb'>;
        Pusher: typeof Pusher;
    }
}

export {};

