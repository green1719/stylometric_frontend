import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import defaultVideo from '../assets/default-video.mp4'
import defaultVideoPoster from '../assets/default-video.svg'
import { proxyMediaUrl } from '../shared/media/proxyMediaUrl'
import { deleteStylometrySample, toggleStylometryLike } from '../features/samples/samplesThunks'

export function FeedPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const samplesItems = useAppSelector((state) => state.samples.items)
  const authStatus = useAppSelector((state) => state.auth.status)
  const isInteractionBlocked = useAppSelector((state) => state.ui.isInteractionBlocked)
  const [currentId, setCurrentId] = useState(Number(id) || samplesItems[0]?.id || 0)
  const sample = samplesItems.find((item) => item.id === currentId) ?? samplesItems[0]
  const videoSource = proxyMediaUrl(sample.videoUrl) || defaultVideo

  useEffect(() => {
    if (id) setCurrentId(Number(id))
  }, [id])

  function showNext() {
    if (!sample || samplesItems.length === 0) return
    const index = samplesItems.findIndex((item) => item.id === sample.id)
    const next = samplesItems[(index + 1) % samplesItems.length]
    setCurrentId(next.id)
    navigate(`/feed/${next.id}`)
  }

  async function toggleLike() {
    if (!sample) return
    if (authStatus !== 'authenticated') {
      navigate('/login')
      return
    }
    await dispatch(toggleStylometryLike({ id: sample.id, like: !sample.isLiked }))
  }

  async function deleteSample() {
    if (!sample || !window.confirm(`Удалить образец «${sample.author}»?`)) return
    try {
      await dispatch(deleteStylometrySample(sample.id)).unwrap()
      navigate('/grid', { replace: true })
    } catch {
      // Error state remains available to the next page.
    }
  }

  if (!sample) return <section className="feed-page"><p className="empty-message">Образцы не найдены.</p></section>

  return <section className="feed-page">
    <video className="feed-media" src={videoSource} poster={defaultVideoPoster} autoPlay muted loop playsInline aria-label={sample.videoUrl ? `Видео к образцу ${sample.author}` : 'Локальная видеозаглушка'} />
    <div className="feed-shade" aria-hidden="true" />
    <header className="feed-header"><p className="eyebrow">Стилометрия</p><h1>Определение авторства</h1></header>
    <section className="feed-content">
      <div className="feed-main"><h2>{sample.author}</h2><details className="description"><summary><span className="description__text">{sample.excerpt}</span><span className="description__more" /></summary></details></div>
      <aside className="feed-side">
        <div className="metrics">
          <div className="metric"><span className="metric__icon"><svg viewBox="0 0 24 24"><path d="M7 3.5h7l3.5 3.5v13.5H7z" /><path d="M14 3.5V7h3.5" /><path d="M10 11h5" /><path d="M10 15h5" /></svg></span><span className="metric__content"><span className="metric__label">Длина предложения</span><strong>{sample.averageSentenceLength} слов</strong></span></div>
          <div className="metric"><span className="metric__icon"><svg viewBox="0 0 24 24"><path d="m10 13.8 4-4" /><path d="m7.7 16.1-1.2 1.2a3.1 3.1 0 0 1-4.4-4.4l3-3a3.1 3.1 0 0 1 4.4 0" /><path d="m16.3 7.9 1.2-1.2a3.1 3.1 0 0 1 4.4 4.4l-3 3a3.1 3.1 0 0 1-4.4 0" /></svg></span><span className="metric__content"><span className="metric__label">Частота союзов</span><strong>{sample.conjunctionFrequency} %</strong></span></div>
        </div>
        <div className="feed-actions"><button className={`feed-action next-button${sample.isLiked ? ' feed-action--liked' : ''}`} onClick={() => void toggleLike()} disabled={isInteractionBlocked} aria-label="Поставить или снять лайк"><span className="round-action"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9.5C1.4 7.7 3.7 5 6.9 5c1.9 0 3.2 1 4.1 2.2C11.9 6 13.2 5 15.1 5c3.2 0 5.5 2.7 3.9 6.5C17 16.5 12 21 12 21Z" /></svg></span><small>{sample.likesCount}</small></button>{sample.isCurrentUserCreator && <button className="feed-action next-button" onClick={() => void deleteSample()} disabled={isInteractionBlocked} aria-label="Удалить свой образец"><span className="round-action"><svg viewBox="0 0 24 24"><path d="M7 7h10" /><path d="M9 7V5h6v2" /><path d="M9 10v7" /><path d="M12 10v7" /><path d="M15 10v7" /><path d="M8 7l1 13h6l1-13" /></svg></span><small>Удалить</small></button>}<button className="feed-action next-button" onClick={showNext} disabled={isInteractionBlocked} aria-label="Следующий образец"><span className="round-action"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span><small>Далее</small></button></div>
      </aside>
    </section>
  </section>
}
