import ShopLayout from '@/Layouts/ShopLayout';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { LiveChatMessage } from '@/types/shop';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type LiveChatPageProps = {
    messages: LiveChatMessage[];
};

export default function LiveChat({ messages }: LiveChatPageProps) {
    const page = usePage();
    const authUser = page.props.auth.user;
    const [items, setItems] = useState<LiveChatMessage[]>(messages);
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    useEffect(() => {
        setItems(messages);
    }, [messages]);

    useEffect(() => {
        if (!authUser || !window.Echo) {
            return;
        }

        const channel = window.Echo.private(`live-chat.${authUser.id}`);
        channel.listen('.chat.message.sent', (event: LiveChatMessage) => {
            setItems((prev) => {
                if (prev.some((message) => message.id === event.id)) {
                    return prev;
                }

                return [...prev, event];
            });
        });

        return () => {
            window.Echo.leave(`private-live-chat.${authUser.id}`);
        };
    }, [authUser]);

    const sortedMessages = useMemo(
        () => [...items].sort((a, b) => a.id - b.id),
        [items],
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(route('live-chat.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('message');
            },
        });
    };

    return (
        <ShopLayout title="Live Chat" hideMobileNav>
            <section className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Support Channel
                    </p>
                    <h1 className="font-display text-3xl text-on-surface">
                        Live chat + assistant bot
                    </h1>
                </div>

                <Card className="space-y-3">
                    {sortedMessages.length === 0 ? (
                        <p className="text-sm text-on-surface/70">
                            Start the conversation. The assistant can answer shipping,
                            returns, order status, and sizing.
                        </p>
                    ) : (
                        sortedMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                                    message.sender_type === 'user'
                                        ? 'ml-auto bg-primary text-white'
                                        : 'bg-surface-3 text-on-surface'
                                }`}
                            >
                                <p>{message.message}</p>
                            </div>
                        ))
                    )}
                </Card>

                <form onSubmit={submit} className="space-y-2">
                    <Textarea
                        value={data.message}
                        onChange={(event) => setData('message', event.target.value)}
                        rows={3}
                        maxLength={1000}
                        placeholder="Write a message..."
                    />
                    {errors.message ? (
                        <p className="text-xs text-red-500">{errors.message}</p>
                    ) : null}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Sending...' : 'Send'}
                        </Button>
                    </div>
                </form>
            </section>
        </ShopLayout>
    );
}

