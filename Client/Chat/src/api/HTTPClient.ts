export class HTTPClient {
    private base_url: string;

    constructor(base_url: string) {
        this.base_url = base_url;
    }

    async request<BodyType, ResponseType>(method: string, path: string, headers?: Record<string, string>, body?: BodyType): Promise<ResponseType> {
        const response = await fetch(`${this.base_url}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(headers ?? {})
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });

        if (!response.ok) {
            const error_text = await response.text();
            let error_message: string;

            try {
                const data = JSON.parse(error_text) as { detail?: string; message?: string };
                error_message = data.detail || data.message || error_text;
            } catch {
                error_message = error_text;
            }

            throw new Error(`${response.status}: ${error_message}`);
        }

        const text = await response.text();
        if (!text) {
            return null as ResponseType;
        }

        return JSON.parse(text) as ResponseType
    }
}
