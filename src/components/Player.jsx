import Play from '../icons/Play.jsx'
import Pause from '../icons/Pause.jsx'
import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '@store/playerStore.js'
import { Slider } from './Slider'

const CurrentSong = ({ image, title, artists }) => {
  return (
    <div className='flex items-center gap-2 relative overflow-hidden'>
      <picture className='size-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden flex-none'>
        <img src={image} alt={`Cover de ${title} por ${artists}`} className='object-cover'/>
      </picture>
      <div className='flex flex-col'>
        <h3 className='text-sm font-medium'>{title}</h3>
        <p className='text-xs text-zinc-400'>{artists}</p>
      </div>
    </div>
  )
}

export default function Player() {
  const { isPlaying, setIsPlaying, currentMusic } = usePlayerStore(state => state)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const { song, playlist, songs } = currentMusic
    if (song) {
      audioRef.current.src = `/music/${playlist?.id}/0${song.id}.mp3`
      isPlaying && audioRef.current.play()
    }
  }, [currentMusic])
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
  return (
    <div className="flex justify-between w-full px-4 z-20">
      <div>
       { currentMusic.song &&  <CurrentSong {...currentMusic.song} /> }
      </div>

      <div className="grid place-content-center gap-4 flex-1">
        <button className="rounded-full bg-gray-100 p-2 text-black" onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Slider defaultValue={[50]} max={100} min={0} className='w-[95px]' onValueChange={(value) => audioRef.current.volume = value / 100} />
      </div>

      <audio ref={audioRef}></audio>
    </div>
  )
}