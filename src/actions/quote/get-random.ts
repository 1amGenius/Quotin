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

export async function getRandomQuote(): Promise<Quote> {
    try {
        // Get selected categories from localStorage (this needs to be done client-side)
        const apiUrl = 'https://api.quotable.io/quotes/random?minLength=77&maxLength=170';
                
        const { data } = await axios.get<QuotableResponse[]>(apiUrl, {
            headers: {
                'Accept': 'application/json',
            },
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            }),
            validateStatus: (status) => status === 200
        })

        const quote = data[0]
        
        return {
            text: quote.content,
            name: quote.author
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout: The API took too long to respond')
            }
            
            console.error('Axios error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            })
        } else {
            console.error('Unexpected error:', error)
        }

        return {
            text: "The best way to predict the future is to invent it.",
            name: "Alan Kay"
        }
    }
}
