import React, { useState } from 'react';
import axios from 'axios';

const ImportPage: React.FC = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setData(null);

        try {
            // Appel à notre API Serverless locale (Vercel)
            const response = await axios.get(`/api/scrape?url=${encodeURIComponent(url)}`);
            setData(response.data);
        } catch (err) {
            setError("Impossible de récupérer les informations. L'URL est peut-être protégée ou invalide.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        alert("Données JSON copiées ! Vous pouvez les coller ou les utiliser pour créer le bien.");
    };

    return (
        <div className="bg-background min-h-screen py-24">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold font-heading text-primary-text mb-8">Importer un bien (Moulinette)</h1>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-border-color">
                    <form onSubmit={handleScrape} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-text mb-1">URL de l'annonce source</label>
                            <div className="flex gap-2">
                                <input 
                                    type="url" 
                                    required
                                    placeholder="https://www.groupementimmo.fr/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="flex-grow px-4 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                />
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Analyse...' : 'Analyser'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                {data && (
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-border-color space-y-6">
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold text-accent">Résultat de l'analyse</h2>
                            <button onClick={copyToClipboard} className="text-sm text-secondary-text hover:text-primary-text underline">Copier JSON</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Prévisualisation Visuelle */}
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-bold text-secondary-text uppercase">Titre</span>
                                    <p className="font-medium text-primary-text">{data.title}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-secondary-text uppercase">Prix</span>
                                    <p className="font-bold text-accent text-xl">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.price)}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="bg-background-alt p-2 rounded">
                                        <span className="block text-xs text-secondary-text">Surface</span>
                                        <strong>{data.surface} m²</strong>
                                    </div>
                                    <div className="bg-background-alt p-2 rounded">
                                        <span className="block text-xs text-secondary-text">Pièces</span>
                                        <strong>{data.rooms}</strong>
                                    </div>
                                    <div className="bg-background-alt p-2 rounded">
                                        <span className="block text-xs text-secondary-text">Chambres</span>
                                        <strong>{data.bedrooms}</strong>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-secondary-text uppercase">Localisation</span>
                                    <p className="font-medium text-primary-text">{data.location || 'Non détectée'}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-secondary-text uppercase">Référence</span>
                                    <p className="font-medium text-primary-text">{data.reference}</p>
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <span className="text-xs font-bold text-secondary-text uppercase mb-2 block">Images détectées ({data.images.length})</span>
                                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                    {data.images.map((img: string, i: number) => (
                                        <img key={i} src={img} alt={`Extracted ${i}`} className="w-full h-24 object-cover rounded border border-gray-200" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-secondary-text uppercase">Description</span>
                            <p className="text-sm text-secondary-text mt-1 p-3 bg-background-alt rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap">
                                {data.description}
                            </p>
                        </div>
                        
                        <div className="pt-6 border-t border-border-color">
                            <p className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <strong>Info :</strong> L'enregistrement automatique vers Sanity nécessite une clé d'API sécurisée. 
                                Pour l'instant, vous pouvez copier ces informations pour créer le bien plus rapidement dans votre Studio.
                            </p>
                            <a 
                                href="https://duroche-immobilier.sanity.studio/structure/property" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex justify-center items-center w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Ouvrir Sanity Studio pour créer le bien
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportPage;