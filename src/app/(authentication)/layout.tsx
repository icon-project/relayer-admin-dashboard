'use client'

import React from 'react'
import { Container } from 'react-bootstrap'
import { SessionProvider } from 'next-auth/react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-light dark:bg-dark min-vh-100 d-flex flex-row align-items-center">
            <Container>
                <SessionProvider>{children}</SessionProvider>{' '}
            </Container>
        </div>
    )
}
