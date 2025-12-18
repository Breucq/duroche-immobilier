import React, { useState, useEffect } from 'react';

interface ShareButtonsProps {
  shareUrl: string;
  title: string;
  heading: string;
  className?: string;
}

// --- Icônes locales ---
const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.523 3.374 4.748 3.415-1.72 1.34-3.884 2.143-6.234 2.143-.404 0-.799-.023-1.19-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
);

const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

/**
 * Composant de partage intelligent. 
 * Utilise l'API Web Share native sur mobile pour forcer l'ouverture des applications.
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({ shareUrl, title, heading, className }) => {
    const [canShare, setCanShare] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Vérifie si le partage natif est disponible (Mobile Chrome/Safari)
        if (navigator.share) {
            setCanShare(true);
        }
    }, []);

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title: title,
                text: `Découvrez ce bien chez Duroche Immobilier : ${title}`,
                url: shareUrl,
            });
        } catch (err) {
            console.log('Partage annulé ou erreur:', err);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className={className}>
            <h3 className="text-lg font-heading font-semibold text-primary-text mb-3">{heading}</h3>
            
            <div className="flex items-center space-x-3">
                {/* SI MOBILE : Bouton de partage natif (Ouvre l'App Facebook directement) */}
                {canShare ? (
                    <button
                        onClick={handleNativeShare}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-white bg-accent hover:bg-accent-dark transition-all shadow-md font-medium"
                    >
                        <ShareIcon className="w-5 h-5 mr-2" />
                        Partager le bien
                    </button>
                ) : (
                    // SI DESKTOP : Liens classiques
                    <>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-[#1877F2] hover:opacity-80 transition-opacity"
                        >
                            <FacebookIcon className="w-5 h-5" />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-[#1DA1F2] hover:opacity-80 transition-opacity"
                        >
                            <TwitterIcon className="w-5 h-5" />
                        </a>
                        <a
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-[#0A66C2] hover:opacity-80 transition-opacity"
                        >
                            <LinkedInIcon className="w-5 h-5" />
                        </a>
                    </>
                )}

                {/* Bouton de copie (toujours utile) */}
                <button
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-gray-600 hover:opacity-80 transition-all focus:outline-none"
                    aria-label="Copier le lien"
                >
                    {copied ? <CheckIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;