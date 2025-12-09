import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface ContactFormProps {
    isPage?: boolean;
    reference?: string;
    title?: string;
    subtitle?: string;
}

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm: React.FC<ContactFormProps> = ({ isPage = false, reference, title, subtitle }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defaultMessage = reference 
        ? `Bonjour,\n\nJe suis intéressé(e) par le bien portant la référence : ${reference}.\nPourriez-vous me recontacter à ce sujet ?\n\nCordialement,`
        : '';

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            message: defaultMessage
        }
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Envoi réel vers Formspree
            const response = await fetch('https://formspree.io/f/xqagvbqp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Crucial pour que Formspree réponde correctement en JSON
                },
                body: JSON.stringify({
                    ...data,
                    // Ajout dynamique de l'objet pour savoir de quel bien il s'agit
                    _subject: reference 
                        ? `Contact pour le bien réf: ${reference} - de ${data.name}` 
                        : `Nouveau message de contact de ${data.name}`
                })
            });

            if (response.ok) {
                console.log("Form Data sent successfully");
                setIsSuccess(true);
                reset();
            } else {
                // Tenter de lire le message d'erreur si disponible
                const result = await response.json().catch(() => ({}));
                console.error("Erreur Formspree", result);
                if (result.error) {
                    throw new Error(result.error);
                }
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de l'envoi. Veuillez vérifier votre connexion ou réessayer plus tard.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseClass = "py-3 px-4 block w-full bg-white shadow-sm border border-border-color rounded-lg focus:ring-1 focus:ring-accent focus:border-accent";
    const errorClass = "mt-1 text-sm text-red-600";

  return (
    <section id="contact" className={`py-24 ${!isPage ? 'bg-background-alt' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
            {!isPage && (
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">
                        {title || 'Contactez-nous'}
                    </h2>
                    <p className="mt-4 text-lg text-secondary-text">
                        {subtitle || "Une question ? Un projet ? N'hésitez pas à nous écrire."}
                    </p>
                </div>
            )}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-border-color/50">
            {isSuccess ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="mt-2 text-xl font-medium text-gray-900">Message envoyé !</h3>
                    <p className="mt-1 text-gray-500">Nous vous recontacterons dans les plus brefs délais.</p>
                    <button onClick={() => setIsSuccess(false)} className="mt-6 text-accent hover:text-accent-dark font-medium">Envoyer un autre message</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-text">Nom & Prénom</label>
                    <div className="mt-1">
                    <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className={inputBaseClass}
                    />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-text">E-mail</label>
                    <div className="mt-1">
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className={inputBaseClass}
                    />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-primary-text">Téléphone</label>
                    <div className="mt-1">
                    <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        className={inputBaseClass}
                    />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary-text">Message</label>
                    <div className="mt-1">
                    <textarea
                        {...register('message')}
                        id="message"
                        rows={6}
                        className={inputBaseClass}
                    ></textarea>
                    {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                    </div>
                </div>
                <div>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                    </button>
                </div>
                </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;