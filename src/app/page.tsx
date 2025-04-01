import Header from '@/components/header/header'
import TextContainer from '@/components/quote/text-container'
import SkeletonContainer from '@/components/quote/skeleton-container'
import { Suspense } from 'react'

export default async function Home() {
    const getRandomColor = () => {
        const colors = [
            '#1a1a1a', // dark gray
            '#000080', // navy
            '#191970', // midnight blue
            '#483D8B', // dark slate blue
            '#27408B', // royal blue 4
            '#4B0082', // indigo
            '#800080', // purple
            '#8B008B', // dark magenta
            '#551A8B', // purple 4
            '#660066', // dark purple
            '#702963', // byzantium
            '#301934', // dark purple
            '#4A0404', // dark burgundy
            '#800000', // maroon
            '#8B0000', // dark red
            '#654321', // dark brown
            '#8B4513', // saddle brown
            '#3D0C02', // black bean
            '#3B2F2F', // dark liver
            '#2F4F4F', // dark slate gray
            '#008080', // teal
            '#004242', // dark teal
            '#004225', // british racing green
            '#006400', // dark green
            '#2F4F2F', // dark sea green
            '#004953', // midnight green
            '#1B1B1B', // eerie black
            '#242124', // raisin black
            '#151515', // onyx
            '#000000' // black
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const color = getRandomColor()

    return (
        <div
            className='min-h-screen min-w-screen z-0 w-full relative overflow-hidden'
            style={{
                background: `linear-gradient(to bottom right, #000000, #000000, ${color})`
            }}
        >
            <Header />
            <Suspense fallback={<SkeletonContainer />}>
                <TextContainer />
            </Suspense>
        </div>
    )
}
