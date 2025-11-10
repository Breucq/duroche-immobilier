import React, { useState, useEffect } from 'react';
import { articleService } from '../services/articleService';
import ShareButtons from '../components/ShareButtons';
import type { Article } from '../types';
import { urlFor } from '../services/sanityClient';

interface ArticleDetailPageProps {
    setCurrentPage: (page: string) => void;
    path: string;
}

const getSlugFromPath = (path: string): string | undefined => path.split('/')[2];

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ setCurrentPage, path }) => {
    const slug = getSlugFromPath(path);
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) {
                setIsLoading(false);
                return;
            }
            try {
                const fetchedArticle = await articleService.getBySlug(slug);
                setArticle(fetchedArticle);
            } catch (error) {
                console.error("Failed to fetch article:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    useEffect(() => {
        const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
            let element = document.querySelector<HTMLMetaElement>(`meta[${attr}='${key}']`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, key);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content || '');
        };

        if (article) {
            const title = `${article.title} | Blog Duroche Immobilier`;
            const description = article.summary;
            const imageUrl = urlFor(article.image).width(1200).height(630).fit('crop').url();
            const pageUrl = window.location.href;

            document.title = title;
            setMetaTag('name', 'description', description);

            // Open Graph (Facebook, etc.)
            setMetaTag('property', 'og:title', title);
            setMetaTag('property', 'og:description', description);
            setMetaTag('property', 'og:image', imageUrl);
            setMetaTag('property', 'og:url', pageUrl);
            setMetaTag('property', 'og:type', 'article');

            // Twitter Card
            setMetaTag('name', 'twitter:card', 'summary_large_image');
            setMetaTag('name', 'twitter:title', title);
            setMetaTag('name', 'twitter:description', description);
            setMetaTag('name', 'twitter:image', imageUrl);
        }
    }, [article]);


    if (isLoading) {
        return <div className="py-48 text-center">Chargement de l'article...</div>;
    }

    if (!article) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold font-heading text-primary-text">Article non trouvé</h1>
                <p className="mt-4 text-secondary-text">L'article que vous cherchez n'existe pas ou a été retiré.</p>
                <button onClick={() => setCurrentPage('/blog')} className="mt-8 inline-block px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark">
                    Retour au blog
                </button>
            </div>
        );
    }

    const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const imageUrl = urlFor(article.image).width(1200).height(600).auto('format').quality(80).url();

    return (
        <div className="bg-background py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <article>
                    <header className="mb-8 pt-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary-text mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <p className="text-secondary-text">
                            Publié par <strong>{article.author}</strong> le {formattedDate}
                        </p>
                    </header>

                    <ShareButtons
                        shareUrl={`https://duroche.fr${path}`}
                        title={article.title}
                        heading="Partager cet article"
                        className="flex flex-col items-center mb-10"
                    />

                    <img
                        src={imageUrl}
                        alt={`Image de couverture pour ${article.title}`}
                        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-12"
                    />
                    <div className="prose prose-lg max-w-none text-secondary-text leading-relaxed whitespace-pre-line">
                        {article.content}
                    </div>
                </article>
                <div className="text-center mt-12">
                     <button onClick={() => setCurrentPage('/blog')} className="inline-block px-6 py-3 border border-accent text-base font-medium rounded-lg text-accent bg-transparent hover:bg-accent/10">
                        &larr; Retour à la liste des articles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailPage;