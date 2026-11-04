import { ArrowLeft, Film } from 'react-bootstrap-icons'
import { Container } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { TEXT_SAMPLES_MOCK } from '../data/samples.mock'
import defaultImage from '../assets/default-image.svg'
import defaultVideo from '../assets/default-video.mp4'
import defaultVideoPoster from '../assets/default-video.svg'

export function SamplePage() {
  const { id } = useParams()
  const sample = TEXT_SAMPLES_MOCK.find((item) => item.id === Number(id))
  if (!sample) return <Container className="page-content"><h1>Карточка не найдена</h1><Link to="/grid">Вернуться к плитке</Link></Container>
  const imageSource = sample.imageUrl?.trim() || defaultImage
  const videoSource = sample.videoUrl?.trim() || defaultVideo
  const isFallbackVideo = !sample.videoUrl?.trim()
  return (
    <Container className="page-content detail-page">
      <Link className="back-link" to="/grid"><ArrowLeft /> К плитке</Link>
      <img className="detail-image" src={imageSource} alt={`Иллюстрация к тексту ${sample.author}`} />
      <section><p className="eyebrow">{sample.topic}</p><h1>{sample.author}</h1><p className="lead">{sample.excerpt}</p><p>Добавлен: {new Intl.DateTimeFormat('ru-RU').format(new Date(sample.createdAt))}</p><div className="detail-video"><Film /> <video src={videoSource} poster={defaultVideoPoster} controls playsInline aria-label={isFallbackVideo ? 'Локальная видеозаглушка' : `Видео к образцу ${sample.author}`} /></div><Link className="btn btn-primary" to={`/feed/${sample.id}`}>Открыть в ленте</Link></section>
    </Container>
  )
}
