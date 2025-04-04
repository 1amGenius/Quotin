import Header from '@/components/header'
import QuoteFetcher from '@/components/quote/quote-fetcher'
import Background from '@/components/background'
import SearchBox from '@/components/search/SearchBox'
import ClockDisplay from '@/components/clock/ClockDisplay'
import Shortcuts from '@/components/shortcuts/Shortcuts'

export default function Home() {
    return (
        <Background>
            <Header />
            <div className='flex flex-col items-center justify-between min-h-[calc(100vh-80px)] pt-36 pb-12 px-4'>
                <div className='w-full max-w-md'>
                    <SearchBox />
                </div>

                {/* Shortcuts section */}
                <Shortcuts />

                <div className='mt-auto mb-8 w-full flex justify-center'>
                    <QuoteFetcher />
                </div>
            </div>
            <ClockDisplay />
        </Background>
    )
}
