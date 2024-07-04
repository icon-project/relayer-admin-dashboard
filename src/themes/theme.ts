import 'server-only'

import { Theme } from '@/themes/enum'
import { cookies } from 'next/headers'

export const getPreferredTheme = () => {
  const preferredThemeCookies = (cookies().get('preferred_theme')?.value ?? Theme.Auto) as Theme

  if (!Object.values(Theme).includes(preferredThemeCookies)) {
    return Theme.Auto
  }

  return preferredThemeCookies
}

export default function getTheme() {
  const themeCookies = (cookies().get('theme')?.value ?? Theme.Light) as Theme

  if (themeCookies !== Theme.Light && themeCookies !== Theme.Dark) {
    return Theme.Light
  }

  return themeCookies
}
