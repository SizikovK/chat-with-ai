export class HTTPClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async request<TBody, TResponse>(method: string, path: string, body?: TBody): Promise<TResponse> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        })
        if(!response.ok) {
            throw new Error(`HTTP POST Error: ${await response.text()}! Status: ${response.status}`)
        }
        return this.parseResponse<TResponse>(response)
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        if (response.status === 204) {
            return null as T
        }

        const text = await response.text()
        if (!text) {
            return null as T
        }

        return JSON.parse(text) as T
    }
}
