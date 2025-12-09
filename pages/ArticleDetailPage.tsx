import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { articleService } from '../services/articleService';
import ShareButtons from '../components/ShareButtons';
import type { Article } from '../types';
import { urlFor } from '../services/sanityClient';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const ArticleDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { pathname: path } = useLocation();
    const setCurrentPage = (page: string) => navigate(page);

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

    const imageUrl = article.image ? urlFor(article.image).width(1200).height(600).auto('format').quality(80).url() : '';
    const shareImageUrl = article.image ? urlFor(article.image).width(1200).height(630).fit('crop').url() : '';
    const pageUrl = window.location.href;
    const seoTitle = `${article.title} | Blog Duroche Immobilier`;
    const seoDescription = article.summary || '';

    // Configuration des composants pour le Portable Text (Texte Riche)
    const portableTextComponents: PortableTextComponents = {
        block: {
            normal: ({ children }) => <p className="mb-4 leading-relaxed text-secondary-text">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold font-heading text-primary-text mt-10 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold font-heading text-primary-text mt-8 mb-4 border-b border-border-color pb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold font-heading text-primary-text mt-6 mb-3">{children}</h3>,
            h4: ({ children }) => <h4 className="text-lg font-bold font-heading text-primary-text mt-4 mb-2">{children}</h4>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-4 italic my-6 text-primary-text bg-background-alt py-2 pr-2 rounded-r">{children}</blockquote>,
        },
        list: {
            bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-secondary-text marker:text-accent">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-secondary-text marker:font-bold">{children}</ol>,
        },
        marks: {
            strong: ({ children }) => <strong className="font-bold text-primary-text">{children}</strong>,
            link: ({ value, children }) => {
                const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
                return (
                    <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="text-accent hover:text-accent-dark underline decoration-accent/30 hover:decoration-accent transition-colors">
                        {children}
                    </a>
                );
            },
        },
        types: {
            image: ({ value }) => {
                if (!value?.asset?._ref) {
                    return null;
                }
                const imgUrl = urlFor(value).width(800).auto('format').url();
                return (
                    <div className="my-8">
                        <img
                            src={imgUrl}
                            alt={value.alt || 'Illustration article'}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                );
            },
        },
    };

    return (
        <div className="bg-background py-24">
             <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={shareImageUrl} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={pageUrl} />
                <meta property="twitter:title" content={seoTitle} />
                <meta property="twitter:description" content={seoDescription} />
                <meta property="twitter:image" content={shareImageUrl} />
            </Helmet>

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

                    {imageUrl && (
                        <div className="relative h-auto max-h-[500px] w-full mb-12 rounded-lg overflow-hidden shadow-lg">
                             <ImageWithSkeleton 
                                src={imageUrl}
                                alt={`Image de couverture pour ${article.title}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="prose prose-lg prose-slate max-w-none mx-auto text-secondary-text leading-relaxed">
                        {/* Logique de rendu conditionnelle */}
                        {article.format === 'html' ? (
                            <div dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }} />
                        ) : (
                            /* Par défaut ou si 'richText', on utilise PortableText */
                            /* Fallback : si content est une string (vieux contenu), on l'affiche simplement */
                            Array.isArray(article.content) ? (
                                <PortableText value={article.content} components={portableTextComponents} />
                            ) : (
                                <p className="whitespace-pre-line">{typeof article.content === 'string' ? article.content : ''}</p>
                            )
                        )}
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