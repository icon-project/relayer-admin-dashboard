import { Theme } from '@/themes/enum'
import { cookies } from 'next/headers'

export const getPreferredTheme = async (): Promise<Theme> => {
    const cookieStore = await cookies()
    const preferredThemeCookies = (cookieStore.get('preferred_theme')?.value ?? Theme.Auto) as Theme

    if (!Object.values(Theme).includes(preferredThemeCookies)) {
        return Theme.Auto
    }

    return preferredThemeCookies
}

export default async function getTheme(): Promise<Theme> {
    const cookieStore = await cookies()
    const themeCookies = (cookieStore.get('theme')?.value ?? Theme.Light) as Theme

    if (themeCookies !== Theme.Light && themeCookies !== Theme.Dark) {
        return Theme.Light
    }

    return themeCookies
}
