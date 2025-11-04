import React, { useState, useEffect } from 'react';
import { articleService } from '../services/articleService';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';

interface BlogListPageProps {
    setCurrentPage: (page: string) => void;
}

const BlogListPage: React.FC<BlogListPageProps> = ({ setCurrentPage }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const fetchedArticles = await articleService.getAll();
                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center pt-8 mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">
                        Notre Blog Immobilier
                    </h1>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                        Suivez nos actualités, conseils et analyses sur le marché immobilier du Vaucluse Nord.
                    </p>
                </div>
                
                {isLoading ? (
                    <div className="text-center py-12">Chargement des articles...</div>
                ) : articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <ArticleCard key={article._id} article={article} setCurrentPage={setCurrentPage} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-secondary-text">Aucun article n'a été publié pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogListPage;