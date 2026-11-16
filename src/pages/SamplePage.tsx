import { ArrowLeft, Calendar3, Film, Heart, PlayFill, Type } from 'react-bootstrap-icons'
import { Container } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import defaultImage from '../assets/default-image.svg'
import defaultVideo from '../assets/default-video.mp4'
import defaultVideoPoster from '../assets/default-video.svg'
import { proxyMediaUrl } from '../shared/media/proxyMediaUrl'
import { deleteStylometrySample, toggleStylometryLike } from '../features/samples/samplesThunks'

export function SamplePage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const samplesItems = useAppSelector((state) => state.samples.items)
  const authStatus = useAppSelector((state) => state.auth.status)
  const isInteractionBlocked = useAppSelector((state) => state.ui.isInteractionBlocked)
  const sample = samplesItems.find((item) => item.id === Number(id))
  if (!sample) return <Container className="page-content"><h1>Карточка не найдена</h1><Link to="/grid">Вернуться к плитке</Link></Container>
  const imageSource = proxyMediaUrl(sample.imageUrl) || defaultImage
  const videoSource = proxyMediaUrl(sample.videoUrl) || defaultVideo
  const isFallbackVideo = !sample.videoUrl?.trim()

  async function toggleLike() {
    if (!sample) return
    if (authStatus !== 'authenticated') {
      navigate('/login')
      return
    }
    await dispatch(toggleStylometryLike({ id: sample.id, like: !sample.isLiked }))
  }

  async function deleteSample() {
    if (!sample) return
    if (!window.confirm(`Удалить образец «${sample.author}»?`)) return
    try {
      await dispatch(deleteStylometrySample(sample.id)).unwrap()
      navigate('/grid', { replace: true })
    } catch {
      // Redux stores the server error for the current request.
    }
  }

  return (
    <Container className="page-content detail-page">
      <Link className="back-link" to="/grid"><ArrowLeft /> К плитке</Link>
      <article className="detail-card">
        <div className="detail-hero">
          <img src={imageSource} alt={`Иллюстрация к тексту ${sample.author}`} />
          <div className="detail-hero__shade" aria-hidden="true" />
          <span className="detail-topic">{sample.topic}</span>
          <span className="detail-hero__label">Текстовый образец</span>
        </div>
        <div className="detail-body">
          <header className="detail-heading">
            <h1>{sample.author}</h1>
            <p className="detail-lead">{sample.excerpt}</p>
          </header>

          <div className="detail-stats" aria-label="Стилометрические показатели">
            <div className="detail-stat"><Type aria-hidden="true" /><span><small>Средняя длина</small><strong>{sample.averageSentenceLength} <em>слов</em></strong></span></div>
            <div className="detail-stat"><span className="detail-stat__link" aria-hidden="true">↗</span><span><small>Частота союзов</small><strong>{sample.conjunctionFrequency}<em>%</em></strong></span></div>
          </div>

          <p className="detail-date"><Calendar3 aria-hidden="true" /> Добавлен {new Intl.DateTimeFormat('ru-RU').format(new Date(sample.createdAt))}</p>

          <section className="detail-video" aria-label="Видео к текстовому образцу">
            <div className="detail-video__heading"><span><Film aria-hidden="true" /><strong>Видео-представление</strong></span><small>{isFallbackVideo ? 'демонстрационный ролик' : 'материалы образца'}</small></div>
            <div className="detail-video__frame"><video src={videoSource} poster={defaultVideoPoster} controls playsInline aria-label={isFallbackVideo ? 'Локальная видеозаглушка' : `Видео к образцу ${sample.author}`} /></div>
          </section>

          <div className="detail-actions">
            <Link className="detail-action detail-action--primary" to={`/feed/${sample.id}`}><PlayFill aria-hidden="true" /> Открыть в ленте</Link>
            <button className={`detail-action detail-action--like${sample.isLiked ? ' is-liked' : ''}`} type="button" disabled={isInteractionBlocked} onClick={() => void toggleLike()}><Heart aria-hidden="true" /> {sample.isLiked ? 'В избранном' : 'Нравится'} <b>{sample.likesCount}</b></button>
            {sample.isCurrentUserCreator && <button className="detail-action detail-action--delete" type="button" disabled={isInteractionBlocked} onClick={() => void deleteSample()}>Удалить</button>}
          </div>
        </div>
      </article>
    </Container>
  )
}
