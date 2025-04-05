import Header from '@/components/header'
import QuoteFetcher from '@/components/quote/quote-fetcher'
import Background from '@/components/background'
import SearchBox from '@/components/search/SearchBox'
import ClockDisplay from '@/components/clock/ClockDisplay'
import Shortcuts from '@/components/shortcuts/Shortcuts'
import WelcomePage from '@/components/welcome/WelcomePage'
import YouTubeLinks from '@/components/YoutubeLinks'
import PinterestLinks from '@/components/PinterestLinks'

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
            <WelcomePage />
            <div className='fixed left-6 bottom-6 z-50 flex items-center gap-4 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10'>
                <YouTubeLinks />
                <div className='h-8 w-px bg-white/20' />
                <PinterestLinks />
            </div>
        </Background>
    )
}
