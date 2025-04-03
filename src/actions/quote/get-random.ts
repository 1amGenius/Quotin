'use server'

import axios from 'axios'
import https from 'https'

interface QuotableResponse {
    _id: string
    content: string
    author: string
    tags: string[]
    authorSlug: string
    length: number
}

interface Quote {
    text: string
    name: string
}

// Fallback quotes to use when API fails
const FALLBACK_QUOTES: Quote[] = [
    {
        text: "The best way to predict the future is to invent it.",
        name: "Alan Kay"
    },
    {
        text: "Simplicity is the ultimate sophistication.",
        name: "Leonardo da Vinci"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        name: "Steve Jobs"
    },
    {
        text: "The only way to do great work is to love what you do.",
        name: "Steve Jobs"
    },
    {
        text: "Stay hungry, stay foolish.",
        name: "Stewart Brand"
    }
];

export async function getRandomQuote(categories?: string[]): Promise<Quote> {
    // Get a random fallback quote
    const getRandomFallbackQuote = (): Quote => {
        const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        return FALLBACK_QUOTES[randomIndex];
    };

    // Try up to 3 times to get a quote
    const MAX_RETRIES = 2;
    let retries = 0;

    while (retries <= MAX_RETRIES) {
        try {
            // Build API URL with categories if provided
            let apiUrl = 'https://api.quotable.io/quotes/random?minLength=77&maxLength=170';
            
            // Add tags parameter if categories are provided
            if (categories && categories.length > 0) {
                const tagsParam = categories.join('|');
                apiUrl += `&tags=${tagsParam}`;
            }
                    
            const { data } = await axios.get<QuotableResponse[]>(apiUrl, {
                headers: {
                    'Accept': 'application/json',
                },
                httpsAgent: new https.Agent({  
                    rejectUnauthorized: false
                }),
                // Add timeout to prevent hanging requests
                timeout: 5000,
                validateStatus: (status) => status === 200
            })

            const quote = data[0]
            
            return {
                text: quote.content,
                name: quote.author
            }
        } catch (error) {
            retries++;
            
            if (retries > MAX_RETRIES) {
                if (axios.isAxiosError(error)) {
                    console.error('Axios error after retries:', {
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data
                    })
                } else {
                    console.error('Unexpected error after retries:', error)
                }
                
                // Return a random fallback quote after all retries fail
                return getRandomFallbackQuote();
            }
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
    }

    // This should never be reached due to the return in the catch block,
    // but TypeScript needs it for type safety
    return getRandomFallbackQuote();
}
