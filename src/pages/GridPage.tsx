import { useMemo, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { TEXT_SAMPLES_MOCK } from '../data/samples.mock'
import { SampleCard } from '../components/SampleCard'
import { SampleFilter } from '../components/SampleFilter'

export function GridPage() {
  const [query, setQuery] = useState('')
  const [maxLength, setMaxLength] = useState(30)
  const [topic, setTopic] = useState('')

  const samples = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU')
    return TEXT_SAMPLES_MOCK.filter((sample) =>
      sample.averageSentenceLength <= maxLength
      && (!topic || sample.topic === topic)
      && (!normalizedQuery || `${sample.author} ${sample.excerpt}`.toLocaleLowerCase('ru-RU').includes(normalizedQuery)),
    )
  }, [maxLength, query, topic])

  function resetFilter() {
    setQuery('')
    setMaxLength(30)
    setTopic('')
  }

  return (
    <Container className="page-content grid-page-content">
      <header className="page-header"><h1>Корпус текстовых образцов</h1></header>
      <SampleFilter query={query} maxLength={maxLength} topic={topic} onQueryChange={setQuery} onMaxLengthChange={setMaxLength} onTopicChange={setTopic} onReset={resetFilter} />
      <p className="visually-hidden" aria-live="polite">Найдено образцов: {samples.length}</p>
      <Row xs={2} className="star-grid g-0">
        {samples.map((sample) => <SampleCard key={sample.id} sample={sample} />)}
      </Row>
      {samples.length === 0 && <p className="empty-message">Образцы не найдены. Измените условия фильтра.</p>}
    </Container>
  )
}
