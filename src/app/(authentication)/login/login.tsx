'use client'

import Loading from '@/components/Loading/Loading'
import useDictionary from '@/locales/dictionary-hook'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Alert, Button, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap'
import InputGroupText from 'react-bootstrap/InputGroupText'

export default function Login({ callbackUrl }: { callbackUrl: string }) {
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const dict = useDictionary()
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push(callbackUrl)
        }
    }, [status, callbackUrl, router])

    const login = async (formData: FormData) => {
        setSubmitting(true)
        setError('')
        try {
            const res = await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirect: false,
                callbackUrl,
            })

            if (!res) {
                setError('Login failed')
                return
            }

            const { ok, url, error: err } = res

            if (!ok) {
                if (err) {
                    setError(err)
                    return
                }

                setError('Login failed')
                return
            }
            router.push(url || '/')
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            {submitting && <Loading />}
            <Alert variant="danger" show={error !== ''} onClose={() => setError('')} dismissible>
                {error}
            </Alert>
            <Form action={login}>
                <InputGroup className="mb-3">
                    <InputGroupText>
                        <FontAwesomeIcon icon={faUser} fixedWidth />
                    </InputGroupText>
                    <FormControl
                        name="email"
                        type="email"
                        required
                        disabled={submitting}
                        placeholder={dict.login.form.email}
                        aria-label="Email"
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroupText>
                        <FontAwesomeIcon icon={faLock} fixedWidth />
                    </InputGroupText>
                    <FormControl
                        type="password"
                        name="password"
                        required
                        disabled={submitting}
                        placeholder={dict.login.form.password}
                        aria-label="Password"
                    />
                </InputGroup>

                <Row className="align-items-center">
                    <Col xs={6}>
                        <Button className="px-4" variant="primary" type="submit" disabled={submitting}>
                            {dict.login.form.submit}
                        </Button>
                    </Col>
                    <Col xs={6} className="text-end">
                        <Link className="px-0" href="#">
                            {dict.login.forgot_password}
                        </Link>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
