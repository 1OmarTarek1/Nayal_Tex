import { useEffect, useState } from 'react'
import './Toast.css'

const Toast = ({ message, type = 'error', duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => {
                onClose?.()
            }, 300)
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    if (!isVisible) return null

    return (
        <div className={`toast toast-${type}`}>
            {type === 'success' && '✓ '}
            {type === 'error' && '✗ '}
            {type === 'warning' && '⚠ '}
            {message}
        </div>
    )
}

export default Toast
