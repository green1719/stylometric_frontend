import { Spinner } from 'react-bootstrap'
import { useAppSelector } from '../app/hooks'

/** Blocks the interface during API work so repeated clicks cannot create duplicate actions. */
export function RequestOverlay() {
  const isInteractionBlocked = useAppSelector((state) => state.ui.isInteractionBlocked)
  if (!isInteractionBlocked) return null

  return (
    <div className="request-overlay" role="status" aria-live="assertive" aria-label="Выполняется запрос">
      <div className="request-overlay__dialog">
        <Spinner animation="border" aria-hidden="true" />
        <span>Выполняется запрос…</span>
      </div>
    </div>
  )
}
