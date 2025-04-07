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
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        name: "John Lennon"
    },
    {
        text: "The purpose of our lives is to be happy.",
        name: "Dalai Lama"
    },
    {
        text: "Get busy living or get busy dying.",
        name: "Stephen King"
    },
    {
        text: "You only live once, but if you do it right, once is enough.",
        name: "Mae West"
    },
    {
        text: "In the end, we only regret the chances we didn't take.",
        name: "Lewis Carroll"
    },
    {
        text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        name: "Nelson Mandela"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        name: "Eleanor Roosevelt"
    },
    {
        text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
        name: "Buddha"
    },
    {
        text: "You miss 100% of the shots you don't take.",
        name: "Wayne Gretzky"
    },
    {
        text: "The only limit to our realization of tomorrow will be our doubts of today.",
        name: "Franklin D. Roosevelt"
    },
    {
        text: "Act as if what you do makes a difference. It does.",
        name: "William James"
    },
    {
        text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        name: "Winston S. Churchill"
    },
    {
        text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        name: "Ralph Waldo Emerson"
    },
    {
        text: "The best revenge is massive success.",
        name: "Frank Sinatra"
    },
    {
        text: "Believe you can and you're halfway there.",
        name: "Theodore Roosevelt"
    },
    {
        text: "Everything you’ve ever wanted is on the other side of fear.",
        name: "George Addair"
    },
    {
        text: "Opportunities don't happen, you create them.",
        name: "Chris Grosser"
    }
];

export async function getRandomQuote(categories?: string[], screenSize?: 'mobile' | 'desktop'): Promise<Quote> {
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
            let apiUrl = 'https://api.quotable.io/quotes/random?';
            
            // Adjust min and max length based on screen size
            if (screenSize === 'mobile') {
                apiUrl += 'minLength=20&maxLength=100';
            } else {
                apiUrl += 'minLength=77&maxLength=170';
            }
            
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
