'use client'

import { FC } from 'react'
import Spinner from 'react-bootstrap/Spinner'

interface LoadingProps {
    children?: React.ReactNode
}

const Loading: FC<LoadingProps> = () => {
    return (
        <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" className="primary" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

export default Loading
