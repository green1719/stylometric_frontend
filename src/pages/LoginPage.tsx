import { useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { loginSucceeded } from '../features/auth/authSlice'
import { setInteractionBlocked } from '../features/ui/uiSlice'
import { loginWithPassword, readApiError } from '../shared/api/authApi'

const JWT_STORAGE_KEY = 'stylometry_jwt'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    dispatch(setInteractionBlocked(true))

    try {
      const accessToken = await loginWithPassword(userName.trim(), password)
      // Redux deliberately remains volatile: F5 returns to the guest UI, while
      // this JWT stays visible in Application → Local Storage for the lab demo.
      localStorage.setItem(JWT_STORAGE_KEY, accessToken)
      dispatch(loginSucceeded({ accessToken, userName: userName.trim() }))
      navigate('/grid', { replace: true })
    } catch (requestError) {
      setError(readApiError(requestError, 'Не удалось выполнить вход.'))
    } finally {
      setIsSubmitting(false)
      dispatch(setInteractionBlocked(false))
    }
  }

  return (
    <Container className="page-content auth-page">
      <header className="page-header"><h1>Вход</h1><p>Войдите, чтобы создавать, отмечать и удалять свои образцы.</p></header>
      <Form className="auth-form" onSubmit={submitLogin}>
        <Form.Group controlId="login-name"><Form.Label>Имя пользователя</Form.Label><Form.Control value={userName} onChange={(event) => setUserName(event.target.value)} autoComplete="username" required disabled={isSubmitting} /></Form.Group>
        <Form.Group controlId="login-password"><Form.Label>Пароль</Form.Label><Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required disabled={isSubmitting} /></Form.Group>
        {error && <Alert variant="danger" className="mb-0">{error}</Alert>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Spinner size="sm" aria-hidden="true" />} {isSubmitting ? 'Вход…' : 'Войти'}</Button>
      </Form>
    </Container>
  )
}
