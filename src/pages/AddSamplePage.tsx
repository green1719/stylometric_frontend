import { useEffect, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { createStylometryDraft, deleteStylometrySample, loadStylometryDraft, publishStylometryDraft } from '../features/samples/samplesThunks'

export function AddSamplePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status: authStatus } = useAppSelector((state) => state.auth)
  const { draft, error, items } = useAppSelector((state) => state.samples)
  const isInteractionBlocked = useAppSelector((state) => state.ui.isInteractionBlocked)
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [isPreparingClassic, setIsPreparingClassic] = useState(false)
  const [classicError, setClassicError] = useState('')

  useEffect(() => {
    if (authStatus === 'authenticated') void dispatch(loadStylometryDraft())
  }, [authStatus, dispatch])

  if (authStatus !== 'authenticated') return <Navigate to="/login" replace />

  async function saveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!image || !video) return
    await dispatch(createStylometryDraft({ author, description, image, video }))
  }

  async function publishDraft() {
    try {
      await dispatch(publishStylometryDraft()).unwrap()
      navigate('/grid', { replace: true })
    } catch {
      // The server message is already placed in Redux and rendered below.
    }
  }

  async function loadMediaFile(path: string, name: string, type: string) {
    const response = await fetch(path)
    if (!response.ok) throw new Error(`Не удалось получить медиафайл (${response.status}).`)
    return new File([await response.blob()], name, { type })
  }

  async function replaceTestSamplesWithTolstoy() {
    setClassicError('')
    setIsPreparingClassic(true)
    try {
      const replaceAuthors = new Set([
        'Лев Толстой',
        'Lev Tolstoy',
        'Проверочный автор',
        'Тестовый автор',
        'Фёдор Достоевский — «Идиот»',
      ])
      for (const sample of items.filter((item) => replaceAuthors.has(item.author))) {
        await dispatch(deleteStylometrySample(sample.id)).unwrap()
      }
      const [classicImage, classicVideo] = await Promise.all([
        loadMediaFile('/s3/stylometry/stylometry_images/stylometry_tolstoy.jpg', 'tolstoy.jpg', 'image/jpeg'),
        loadMediaFile('/s3/stylometry/stylometry_videos/stylometry_tolstoy.mp4', 'tolstoy.mp4', 'video/mp4'),
      ])
      await dispatch(createStylometryDraft({
        author: 'Лев Толстой — «Анна Каренина»',
        description: 'Все смешалось в доме Облонских. Жена узнала, что муж был в связи с бывшею в их доме гувернанткою, и объявила мужу, что не может жить с ним в одном доме. Это положение продолжалось уже третий день.',
        image: classicImage,
        video: classicVideo,
      })).unwrap()
      await dispatch(publishStylometryDraft()).unwrap()
      navigate('/grid', { replace: true })
    } catch (error) {
      setClassicError(error instanceof Error ? error.message : 'Не удалось создать образец классика.')
    } finally {
      setIsPreparingClassic(false)
    }
  }

  return (
    <Container className="page-content add-page">
      <header className="page-header"><h1>Добавить образец</h1><p>Сначала сохраните черновик, затем опубликуйте его.</p></header>
      <section className="classic-preset" aria-label="Готовый образец классика">
        <div><span>Обновление каталога</span><strong>Лев Толстой · «Анна Каренина»</strong><p>Проверочные записи и прежняя карточка Толстого будут удалены, затем появится обновлённый образец с медиа из MinIO.</p></div>
        <Button type="button" onClick={() => void replaceTestSamplesWithTolstoy()} disabled={isInteractionBlocked || isPreparingClassic}>{(isInteractionBlocked || isPreparingClassic) && <Spinner size="sm" aria-hidden="true" />} Очистить и опубликовать</Button>
        {classicError && <Alert variant="danger" className="mb-0">{classicError}</Alert>}
      </section>
      {draft
        ? <section className="draft-ready" aria-live="polite">
            <strong>Открыт сохранённый черновик «{draft.author}».</strong>
            <Form className="draft-preview">
              <Form.Group controlId="saved-draft-author"><Form.Label>Автор текста</Form.Label><Form.Control value={draft.author} readOnly /></Form.Group>
              <Form.Group controlId="saved-draft-description"><Form.Label>Текстовый отрывок</Form.Label><Form.Control as="textarea" rows={4} value={draft.excerpt} readOnly /></Form.Group>
              <span>Изображение и видео уже сохранены на сервере вместе с черновиком.</span>
            </Form>
            {error && <Alert variant="danger" className="mb-0">{error}</Alert>}
            <Button onClick={() => void publishDraft()} disabled={isInteractionBlocked}>{isInteractionBlocked && <Spinner size="sm" aria-hidden="true" />} Опубликовать</Button>
          </section>
        : <Form className="auth-form" onSubmit={saveDraft}>
            <Form.Group controlId="sample-author"><Form.Label>Автор текста</Form.Label><Form.Control value={author} onChange={(event) => setAuthor(event.target.value)} required disabled={isInteractionBlocked} /></Form.Group>
            <Form.Group controlId="sample-description"><Form.Label>Текстовый отрывок</Form.Label><Form.Control as="textarea" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} required disabled={isInteractionBlocked} /></Form.Group>
            <Form.Group controlId="sample-image"><Form.Label>Изображение</Form.Label><Form.Control type="file" accept="image/*" onChange={(event) => setImage((event.target as HTMLInputElement).files?.[0] ?? null)} required disabled={isInteractionBlocked} /></Form.Group>
            <Form.Group controlId="sample-video"><Form.Label>Видео</Form.Label><Form.Control type="file" accept="video/*" onChange={(event) => setVideo((event.target as HTMLInputElement).files?.[0] ?? null)} required disabled={isInteractionBlocked} /></Form.Group>
            {error && <Alert variant="danger" className="mb-0">{error}</Alert>}
            <Button type="submit" disabled={isInteractionBlocked}>{isInteractionBlocked && <Spinner size="sm" aria-hidden="true" />} Сохранить черновик</Button>
          </Form>}
    </Container>
  )
}
