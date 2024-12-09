import { defaultLocale } from '@/locales/config'
import { cookies } from 'next/headers'

const dictionaries = {
    en: () => import('./en/lang.json').then((module) => module.default),
}

type Locale = keyof typeof dictionaries

export const getLocales = () => Object.keys(dictionaries) as Array<Locale>

export const getLocale = async (): Promise<Locale> => {
    const cookiesStore = await cookies()
    const localeCookies = cookiesStore.get('locale')?.value ?? defaultLocale

    if (!getLocales().includes(localeCookies as Locale)) {
        return defaultLocale
    }

    return localeCookies as Locale
}

export const getDictionary = async () => {
    const locale = await getLocale()
    return dictionaries[locale]()
}
