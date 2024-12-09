import { getLocale } from '@/locales/dictionary'
import i18next from 'i18next'
import { z } from 'zod'
import { makeZodI18nMap } from 'zod-i18n-map'
import enTranslation from 'zod-i18n-map/locales/en/zod.json'

const en = i18next.createInstance()
en.init({
    lng: 'en',
    resources: {
        en: { zod: enTranslation },
    },
})

const zodMap = {
    en: makeZodI18nMap({ t: en.t }),
}

// Set zod error map by user's locale.
// The error message should be translated based on user's locale.
z.setErrorMap((err, ctx) => {
    let message = 'An error occurred'
    getLocale().then((locale) => {
        message = zodMap[locale](err, ctx).message
    })
    return { message }
})

export { z }
