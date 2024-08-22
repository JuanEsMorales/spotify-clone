import Play from '../icons/Play.jsx'
import Pause from '../icons/Pause.jsx'

import { usePlayerStore } from '@store/playerStore'

export default function CardPlayButton({ id, size = 'small' }) {
  const { isPlaying, setIsPlaying, currentMusic, setCurrentMusic } = usePlayerStore(state => state)

  const isPlayingPlaylist = currentMusic.playlist?.id === id && isPlaying

  const handlePlayPause = () => {
    if (isPlayingPlaylist) {
      setIsPlaying(false)
      return
    }

    fetch(`/api/get-info-playlist.json?id=${id}`)
      .then(res => res.json())
      .then(data => {
        const { playlist, songs } = data
        
        setCurrentMusic({ playlist, songs, song: songs[0] })
        setIsPlaying(true)
      })
  }


  return (
    <button className={`rounded-full bg-green-500 ${size === 'small' ? 'p-4' : 'p-5'} text-black hover:bg-green-400 hover:scale-105 transition`} onClick={handlePlayPause}>
      {isPlayingPlaylist ? <Pause /> : <Play />}
    </button>
  )
}