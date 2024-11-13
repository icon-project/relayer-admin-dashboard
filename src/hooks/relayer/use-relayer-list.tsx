'use client'

import { RelayerInfo } from '@/utils/relayer'
import Cookies from 'js-cookie'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface RelayerContextProps {
    relayers: RelayerInfo[]
    currentRelayer: RelayerInfo | null
    setCurrentRelayer: (relayer: RelayerInfo | null) => void
}

const RelayerContext = createContext<RelayerContextProps | undefined>(undefined)

export const RelayerProvider = ({ relayers, children }: { relayers: RelayerInfo[]; children: ReactNode }) => {
    const [currentRelayer, setCurrentRelayer] = useState<RelayerInfo | null>(null)

    useEffect(() => {
        const savedRelayerId = Cookies.get('relayerId')
        if (savedRelayerId) {
            const savedRelayer = relayers.find((relayer) => relayer.id === savedRelayerId) || null
            setCurrentRelayer(savedRelayer)
        }
    }, [relayers])

    return (
        <RelayerContext.Provider value={{ relayers, currentRelayer, setCurrentRelayer }}>
            {children}
        </RelayerContext.Provider>
    )
}

export const useRelayer = () => {
    const context = useContext(RelayerContext)
    if (!context) {
        throw new Error('useRelayer must be used within a RelayerProvider')
    }
    return context
}
