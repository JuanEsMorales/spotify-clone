import Play from '../icons/Play.jsx'
import Pause from '../icons/Pause.jsx'
import { Silence } from '../icons/Silence.jsx'
import { VolumeMedium } from '../icons/VolumeMedium.jsx'
import { VolumeMax } from '../icons/VolumeMax.jsx'
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

const PlaceholderCurrentSong = () => (
  <div className='flex items-center gap-2 relative overflow-hidden'>
    <div className='w-16 h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden flex-none'></div>
    <div className='flex flex-col opacity-0'>
      <h3 className='text-sm font-medium'>Placeholder</h3>
      <p className='text-xs text-zinc-400'>Placeholder</p>
    </div>
  </div>
)

const VolumeControl = () => {
  const volume = usePlayerStore(state => state.volume)
  const setVolume = usePlayerStore(state => state.setVolume)
  const previousVolume = useRef(volume)
  const isMuted = volume < 1
  const handleClickVolume = () => {
    if (isMuted) {
      setVolume(previousVolume.current)
    } else {
      previousVolume.current = volume
      setVolume(0)
    }
  }

  return <div className='flex items-center gap-2'>
    <button className='opacity-70 hover:opacity-100 transition-opacity' onClick={handleClickVolume}>
      {isMuted ? <Silence /> : volume < 50 ? <VolumeMedium /> : <VolumeMax />}
    </button>
    <Slider defaultValue={[volume]} max={100} min={0} className='w-[95px]' value={[volume]} onValueChange={(value) => setVolume(value)} />
  </div>
}

const SongControl = ({ audio }) => {
  const [currentTime, setCurrentTime] = useState(0)

  const handleTimeUpdate = () => {
    setCurrentTime(audio.current.currentTime)
  }

  const duration = audio?.current?.duration ?? null

  const formatTime = (time) => {
    if (time == null) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    audio.current.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      audio.current.removeEventListener('timeupdate', handleTimeUpdate)
    }
  })

  return (
    <div className='flex items-center gap-2 text-xs opacity-70 hover:opacity-100 transition-opacity'>
      <span>{formatTime(currentTime)}</span>
        <Slider defaultValue={[0]} max={duration} min={0} className='w-[400px]' value={[currentTime]} onValueChange={(value) => audio.current.currentTime = value} />
      <span>{duration ? formatTime(duration) : '00:00'}</span>
    </div>
  )
}

export default function Player() {
  const { isPlaying, setIsPlaying, currentMusic, volume } = usePlayerStore(state => state)
  const audioRef = useRef(null)

  useEffect(() => {
    const { song, playlist, songs } = currentMusic
    if (song) {
      audioRef.current.src = `/music/${playlist?.id}/0${song.id}.mp3`
      isPlaying && audioRef.current.play()
    }
  }, [currentMusic])
  
  useEffect(() => {
    audioRef.current.volume = volume / 100
  }, [volume])
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
  return (
    <div className="flex justify-between w-full z-20">
      <div className='w-[200px]'>
       { currentMusic.song ?  <CurrentSong {...currentMusic.song} /> : <PlaceholderCurrentSong /> }
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <button 
          className="rounded-full w-max bg-gray-100 p-2 text-black disabled:text-black/30"
          disabled={!currentMusic.song} 
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <SongControl audio={audioRef} />
      </div>

      <div className="flex items-center gap-2">
        <VolumeControl />
      </div>

      <audio ref={audioRef}></audio>
    </div>
  )
}