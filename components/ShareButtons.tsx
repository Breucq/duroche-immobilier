import React from 'react';

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

const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const ShareButton: React.FC<{ href: string, children: React.ReactNode, label: string, className: string }> = ({ href, children, label, className }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Partager sur ${label}`}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition-opacity hover:opacity-80 ${className}`}
    >
        {children}
    </a>
);

/**
 * Composant affichant une série de boutons de partage pour les réseaux sociaux et l'e-mail.
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({ shareUrl, title, heading, className }) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedTitle}`,
        mail: `mailto:?subject=${encodedTitle}&body=Je pensais que cela pourrait t'intéresser : ${encodedUrl}`,
    };

    return (
        <div className={className}>
            <h3 className="text-lg font-heading font-semibold text-primary-text mb-3">{heading}</h3>
            <div className="flex items-center space-x-3">
                <ShareButton href={shareLinks.facebook} label="Facebook" className="bg-[#1877F2]">
                    <FacebookIcon className="w-5 h-5" />
                </ShareButton>
                <ShareButton href={shareLinks.twitter} label="Twitter" className="bg-[#1DA1F2]">
                    <TwitterIcon className="w-5 h-5" />
                </ShareButton>
                <ShareButton href={shareLinks.linkedin} label="LinkedIn" className="bg-[#0A66C2]">
                    <LinkedInIcon className="w-5 h-5" />
                </ShareButton>
                <ShareButton href={shareLinks.mail} label="E-mail" className="bg-secondary">
                    <MailIcon className="w-5 h-5" />
                </ShareButton>
            </div>
        </div>
    );
};

export default ShareButtons;