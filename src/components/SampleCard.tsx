import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import defaultImage from '../assets/default-image.svg'
import type { TextSample } from '../types/sample'

interface SampleCardProps {
  sample: TextSample
}

export function SampleCard({ sample }: SampleCardProps) {
  const imageSource = sample.imageUrl?.trim() || defaultImage

  return (
    <Col className="star-card-col">
      <Card className="star-card border-0">
        <Link className="star-card__link" to={`/sample/${sample.id}`} aria-label={`Открыть карточку ${sample.author}`}>
          <Card.Img src={imageSource} alt={`Иллюстрация к тексту ${sample.author}`} />
          <span className="star-card__shade" aria-hidden="true" />
          <Card.Body className="star-card__body">
            <p className="star-card__distance">Длина = {sample.averageSentenceLength} слов</p>
            <Card.Title as="h2">{sample.author}</Card.Title>
          </Card.Body>
        </Link>
      </Card>
    </Col>
  )
}
