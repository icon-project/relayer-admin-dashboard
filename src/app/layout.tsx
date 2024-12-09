import '@/styles/globals.scss'
// Next.js allows you to import CSS directly in .js files.
// It handles optimization and all the necessary Webpack configuration to make this work.
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import { RelayerProvider } from '@/hooks/relayer/use-relayer-list'
import { defaultLocale } from '@/locales/config'
import { getDictionary } from '@/locales/dictionary'
import DictionaryProvider from '@/locales/DictionaryProvider'
import getTheme from '@/themes/theme'
import { getAvailableRelayers } from '@/utils/relayer'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

// You change this configuration value to false so that the Font Awesome core SVG library
// will not try and insert <style> elements into the <head> of the page.
// Next.js blocks this from happening anyway so you might as well not even try.
// See https://fontawesome.com/v6/docs/web/use-with/react/use-with#next-js
config.autoAddCss = false

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const dictionary = await getDictionary()
    const relayers = await getAvailableRelayers()
    const theme = await getTheme()

    return (
        <html lang={defaultLocale} data-bs-theme={theme}>
            <head>
                <title>Relayer Dashboard</title>
            </head>
            <body>
                <ProgressBar />
                <DictionaryProvider dictionary={dictionary}>
                    <RelayerProvider relayers={relayers}>{children}</RelayerProvider>
                </DictionaryProvider>
            </body>
        </html>
    )
}
