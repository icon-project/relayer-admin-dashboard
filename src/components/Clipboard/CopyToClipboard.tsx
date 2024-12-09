import { faClipboard } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Button } from 'react-bootstrap'

const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content)
            setIsCopied(true)
            console.log('Copied to clipboard:', content)
        } catch (error) {
            setIsCopied(false)
            console.error('Unable to copy to clipboard:', error)
        }
    }

    return { isCopied, copyToClipboard }
}

const CopyToClipboardButton: React.FC<{ content: string }> = ({ content }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard()

    return (
        <Button variant="link" className="text-decoration-none" onClick={() => copyToClipboard(content)}>
            <FontAwesomeIcon icon={faClipboard} />
            {isCopied && <span className="ml-2">Copied!</span>}
        </Button>
    )
}

export default CopyToClipboardButton
