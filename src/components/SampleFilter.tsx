import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

interface SampleFilterProps {
  query: string
  maxLength: number
  topic: string
  onQueryChange: (value: string) => void
  onMaxLengthChange: (value: number) => void
  onTopicChange: (value: string) => void
  onReset: () => void
}

export function SampleFilter({
  query,
  maxLength,
  topic,
  onQueryChange,
  onMaxLengthChange,
  onTopicChange,
  onReset,
}: SampleFilterProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <Form className="filter-form" onSubmit={(event) => event.preventDefault()}>
      <div className="filter-form__head">
        <Form.Label htmlFor="sentence-length">Длина предложения — не больше</Form.Label>
        <output htmlFor="sentence-length">{maxLength} слов</output>
      </div>
      <Form.Range className="filter-form__slider" id="sentence-length" min={4} max={30} value={maxLength} onChange={(event) => onMaxLengthChange(Number(event.target.value))} />
      <div className="filter-form__scale" aria-hidden="true"><span>4</span><span>30</span></div>
      <button className="round-action round-action--submit" type="button" aria-label="Показать фильтры" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}><Search aria-hidden="true" /></button>
      {filtersOpen && <div className="filter-form__extras">
        <Form.Select aria-label="Тема" id="sample-topic" value={topic} onChange={(event) => onTopicChange(event.target.value)}>
          <option value="">Все темы</option>
          <option value="Классика">Классика</option>
          <option value="Поэзия">Поэзия</option>
          <option value="Проза">Проза</option>
        </Form.Select>
        <Form.Control aria-label="Автор или фрагмент" id="sample-query" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Автор или фрагмент" />
        <button className="filter-form__reset" type="button" onClick={() => { onReset(); setFiltersOpen(false) }}>Сброс</button>
      </div>}
    </Form>
  )
}
