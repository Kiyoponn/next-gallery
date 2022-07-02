import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

export async function getStaticProps() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  const { data } = await supabaseAdmin
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    props: {
      images: data,
    },
    revalidate: 1,
  }
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Image = {
  id: number
  href: string
  imageSrc: string
  name: string
  username: string
}

const Gallery = ({ images }: { images: Image[] }) => {
  return (
    <>
      <h1 className='mt-6 text-center text-6xl font-black leading-tight text-white lg:text-8xl'>
        Instagram
        <span className='text-fuchsia-400'> Gallery</span>
      </h1>
      <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
          {images.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
    </>
  )
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <a href={image.href} className='group'>
      <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8'>
        <Image
          alt={image.name}
          src={image.imageSrc}
          layout='fill'
          objectFit='cover'
          className={cn(
            'duration-700 ease-in-out group-hover:opacity-75',
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          )}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
      <h3 className='test-sm mt-4 text-gray-200'>{image.name}</h3>
      <p className='mt-1 text-lg font-medium text-gray-100'>{image.username}</p>
    </a>
  )
}

export default Gallery
