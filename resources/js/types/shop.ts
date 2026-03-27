export interface ShopCategory {
    id: number;
    slug: string;
    name: string;
}

export interface ShopCategoryNested {
    slug: string;
    name: string;
}

export interface ShopProduct {
    id: number;
    slug: string;
    name: string;
    label: string | null;
    price_cents: number;
    currency: string;
    image_url: string | null;
    is_new: boolean;
    is_sold_out: boolean;
    category?: ShopCategoryNested | null;
}

export interface ShopProductDetail extends ShopProduct {
    description: string | null;
}

export interface CartLine {
    product_id: number;
    quantity: number;
    line_total_cents: number;
    product: Pick<
        ShopProduct,
        | 'id'
        | 'slug'
        | 'name'
        | 'label'
        | 'price_cents'
        | 'currency'
        | 'image_url'
        | 'is_sold_out'
    >;
}

export interface CheckoutUserPreview {
    name: string;
    email: string;
}

export interface OrderSummary {
    id: number;
    order_number: string;
    status: string;
    currency: string;
    subtotal_cents: number;
    tax_cents: number;
    shipping_cents: number;
    total_cents: number;
    placed_at: string | null;
    shipping: {
        name: string;
        phone: string;
        address_line1: string;
        address_line2: string | null;
        city: string;
        state: string | null;
        postal_code: string;
        country: string;
    };
    items: Array<{
        id: number;
        product_slug: string | null;
        product_name: string;
        unit_price_cents: number;
        quantity: number;
        line_total_cents: number;
    }>;
}

export interface LaravelPaginatorMetaLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface LiveChatMessage {
    id: number;
    user_id: number;
    sender_type: 'user' | 'bot' | 'agent';
    message: string;
    created_at: string | null;
}

/** Laravel `LengthAwarePaginator::toArray()` shape */
export interface LaravelPaginator<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: LaravelPaginatorMetaLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
