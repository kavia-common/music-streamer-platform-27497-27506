import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  play,
  pause,
  next,
  prev,
  seek,
  setVolume,
  toggleShuffle,
  toggleRepeat,
} from '../../state/slices/playerSlice';

/**
 * PUBLIC_INTERFACE
 * PlayerBar
 * Bottom docked player control bar with Ocean Professional styling.
 * - Shows current track info (artwork, title, artist)
 * - Provides controls: prev, play/pause, next, shuffle, repeat
 * - Seek slider and volume slider
 * - Fully accessible with ARIA labels and keyboard focus
 *
 * NOTE: UI only; no audio element integration. It uses Redux playerSlice state.
 */
export default function PlayerBar() {
  const dispatch = useDispatch();
  const {
    currentTrack,
    isPlaying,
    position,
    volume,
    shuffle,
    repeat,
    queue,
  } = useSelector((state) => state.player);

  const duration = currentTrack?.duration ?? 0; // seconds (UI only)
  const cover = currentTrack?.cover || currentTrack?.artwork || null;
  const title = currentTrack?.title || 'Nothing playing';
  const artist = currentTrack?.artist || (currentTrack ? 'Unknown Artist' : '—');

  // Handlers
  const onPlayPause = () => {
    if (isPlaying) dispatch(pause());
    else dispatch(play());
  };

  const onPrev = () => dispatch(prev());
  const onNext = () => dispatch(next());

  const onSeek = (e) => {
    const sec = Number(e.target.value);
    if (!Number.isNaN(sec)) dispatch(seek(sec));
  };

  const onVolume = (e) => {
    const v = Number(e.target.value);
    if (!Number.isNaN(v)) dispatch(setVolume(v));
  };

  const onShuffle = () => dispatch(toggleShuffle());
  const onRepeat = () => dispatch(toggleRepeat());

  const isDisabled = !currentTrack && (!queue || queue.length === 0);

  // Format time helper mm:ss
  const fmt = (sec) => {
    if (!sec || sec < 0 || !Number.isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Repeat icon based on mode
  const repeatIcon = repeat === 'one' ? '🔁1' : (repeat === 'all' ? '🔁' : '➡️');

  return (
    <div
      className="player-bar surface"
      role="contentinfo"
      aria-label="Player controls"
    >
      <div className="player-bar__inner container" style={{ padding: 0 }}>
        {/* Left: Track info */}
        <div className="player-bar__track">
          <div
            className="player-bar__artwork surface"
            aria-hidden="true"
            style={{ overflow: 'hidden' }}
          >
            {cover ? (
              <img
                src={cover}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
          </div>
          <div className="player-bar__meta">
            <div className="player-bar__title" title={title}>
              {title}
            </div>
            <div className="player-bar__artist text-muted" title={artist}>
              {artist}
            </div>
          </div>
        </div>

        {/* Center: Transport + Seek */}
        <div className="player-bar__transport">
          <div className="player-bar__controls" role="group" aria-label="Playback">
            <button
              type="button"
              className={`btn-icon shadow-hover ${shuffle ? 'is-active' : ''}`}
              aria-pressed={shuffle}
              aria-label="Toggle shuffle"
              onClick={onShuffle}
              title="Shuffle"
            >
              🔀
            </button>
            <button
              type="button"
              className="btn-icon shadow-hover"
              aria-label="Previous"
              onClick={onPrev}
              disabled={isDisabled}
              title="Previous"
            >
              ⏮
            </button>
            <button
              type="button"
              className="btn-icon btn-primary shadow-hover"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={onPlayPause}
              disabled={isDisabled}
              title={isPlaying ? 'Pause' : 'Play'}
              style={{ minWidth: 44 }}
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <button
              type="button"
              className="btn-icon shadow-hover"
              aria-label="Next"
              onClick={onNext}
              disabled={isDisabled}
              title="Next"
            >
              ⏭
            </button>
            <button
              type="button"
              className={`btn-icon shadow-hover ${repeat !== 'off' ? 'is-active' : ''}`}
              aria-label={`Toggle repeat mode (current: ${repeat})`}
              onClick={onRepeat}
              title={`Repeat: ${repeat}`}
            >
              {repeatIcon}
            </button>
          </div>

          <div className="player-bar__seek">
            <span className="player-bar__time text-muted" aria-live="polite">
              {fmt(position)}
            </span>
            <input
              className="player-bar__slider"
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Math.min(position, duration || 0)}
              onChange={onSeek}
              aria-label="Seek position"
              disabled={!currentTrack}
            />
            <span className="player-bar__time text-muted">{fmt(duration)}</span>
          </div>
        </div>

        {/* Right: Volume */}
        <div className="player-bar__volume" role="group" aria-label="Volume">
          <span aria-hidden="true" title="Volume">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}
          </span>
          <input
            className="player-bar__slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolume}
            aria-label="Set volume"
          />
        </div>
      </div>
    </div>
  );
}
