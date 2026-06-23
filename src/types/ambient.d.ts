declare module 'front-matter' {
    export interface FrontMatterResult<TAttributes = Record<string, unknown>> {
        attributes: TAttributes;
        body: string;
    }

    export default function fm<TAttributes = Record<string, unknown>>(input: string): FrontMatterResult<TAttributes>;
}

declare global {
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                [elemName: string]: any;
            }
        }
    }

    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export {};
