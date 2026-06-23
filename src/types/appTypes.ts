export type NavigateFn = (page?: string) => void;

export interface Post {
    slug: string;
    title: string;
    date: string;
    summary: string;
    content: string;
}

export interface NwsAlert {
    id: string;
    area: string;
    event: string;
    headline: string;
}
