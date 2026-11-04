import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TEXT_SAMPLES_MOCK } from '../data/samples.mock'
import defaultVideo from '../assets/default-video.mp4'
import defaultVideoPoster from '../assets/default-video.svg'

export function FeedPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentId, setCurrentId] = useState(Number(id) || TEXT_SAMPLES_MOCK[0].id)
  const sample = TEXT_SAMPLES_MOCK.find((item) => item.id === currentId) ?? TEXT_SAMPLES_MOCK[0]
  const videoSource = sample.videoUrl?.trim() || defaultVideo

  useEffect(() => {
    if (id) setCurrentId(Number(id))
  }, [id])

  function showNext() {
    const index = TEXT_SAMPLES_MOCK.findIndex((item) => item.id === sample.id)
    const next = TEXT_SAMPLES_MOCK[(index + 1) % TEXT_SAMPLES_MOCK.length]
    setCurrentId(next.id)
    navigate(`/feed/${next.id}`)
  }

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
        <div className="feed-actions"><span className="feed-action feed-action--like"><span className="round-action"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9.5C1.4 7.7 3.7 5 6.9 5c1.9 0 3.2 1 4.1 2.2C11.9 6 13.2 5 15.1 5c3.2 0 5.5 2.7 3.9 6.5C17 16.5 12 21 12 21Z" /></svg></span><small>{sample.likesCount}</small></span><button className="feed-action next-button" onClick={showNext} aria-label="Следующий образец"><span className="round-action"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span><small>Далее</small></button></div>
      </aside>
    </section>
  </section>
}
