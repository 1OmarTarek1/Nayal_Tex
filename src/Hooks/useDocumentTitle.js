import { useEffect } from 'react';

/**
 * Custom hook to set document title dynamically
 * @param {string} title - The page title (will append "Nayal Tex | ")
 */
const useDocumentTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title ? `Nayal Tex | ${title}` : 'Nayal Tex';

        // Cleanup: restore previous title on unmount
        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};

export default useDocumentTitle;
