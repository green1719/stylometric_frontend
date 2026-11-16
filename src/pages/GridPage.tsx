import { useEffect, useMemo } from 'react'
import { Container, Row, Spinner } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { SampleCard } from '../components/SampleCard'
import { SampleFilter } from '../components/SampleFilter'
import { resetFilters, setMaxLength, setQuery, setTopic } from '../features/filters/filtersSlice'
import { loadStylometrySamples } from '../features/samples/samplesThunks'

export function GridPage() {
  const dispatch = useAppDispatch()
  const { query, maxLength, topic } = useAppSelector((state) => state.filters)
  const { items: samplesItems, status, error } = useAppSelector((state) => state.samples)
  const authStatus = useAppSelector((state) => state.auth.status)
  const isInteractionBlocked = useAppSelector((state) => state.ui.isInteractionBlocked)

  useEffect(() => {
    void dispatch(loadStylometrySamples())
  }, [authStatus, dispatch, maxLength])

  const samples = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU')
    return samplesItems.filter((sample) =>
      sample.averageSentenceLength <= maxLength
      && (!topic || sample.topic === topic)
      && (!normalizedQuery || `${sample.author} ${sample.excerpt}`.toLocaleLowerCase('ru-RU').includes(normalizedQuery)),
    )
  }, [maxLength, query, samplesItems, topic])

  return (
    <Container className="page-content grid-page-content">
      <header className="page-header"><h1>Корпус текстовых образцов</h1></header>
      <SampleFilter query={query} maxLength={maxLength} topic={topic} onQueryChange={(value) => dispatch(setQuery(value))} onMaxLengthChange={(value) => dispatch(setMaxLength(value))} onTopicChange={(value) => dispatch(setTopic(value))} onReset={() => dispatch(resetFilters())} disabled={isInteractionBlocked} />
      {status === 'loading' && <p className="loading-message"><Spinner size="sm" aria-hidden="true" /> Загрузка образцов…</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      <p className="visually-hidden" aria-live="polite">Найдено образцов: {samples.length}</p>
      <Row xs={2} className="star-grid g-0">
        {samples.map((sample) => <SampleCard key={sample.id} sample={sample} />)}
      </Row>
      {samples.length === 0 && <p className="empty-message">Образцы не найдены. Измените условия фильтра.</p>}
    </Container>
  )
}
