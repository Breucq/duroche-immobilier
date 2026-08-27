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
  subject: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm: React.FC<ContactFormProps> = ({ isPage = false, reference, title, subtitle }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defaultSubject = reference 
        ? `Renseignement sur un bien (Réf: ${reference})`
        : 'Estimer un bien (Vente)';

    const defaultMessage = reference 
        ? `Bonjour,\n\nJe suis intéressé(e) par le bien portant la référence : ${reference}.\nPourriez-vous me recontacter à ce sujet ?\n\nCordialement,`
        : '';

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            subject: defaultSubject,
            message: defaultMessage
        }
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Envoi réel vers Formspree
            const subjectLabel = data.subject || 'Demande de contact';
            const response = await fetch('https://formspree.io/f/xqagvbqp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Crucial pour que Formspree réponde correctement en JSON
                },
                body: JSON.stringify({
                    ...data,
                    // Ajout dynamique de l'objet pour savoir de quel bien / sujet il s'agit
                    _subject: reference 
                        ? `[${subjectLabel}] Réf: ${reference} - de ${data.name}` 
                        : `[${subjectLabel}] Message de ${data.name}`
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
    <section id="contact" className={`${!isPage ? 'py-24 bg-background-alt' : ''}`}>
      <div className={!isPage ? "container mx-auto px-4 sm:px-6 lg:px-8" : ""}>
        <div className={!isPage ? "max-w-3xl mx-auto" : ""}>
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
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-border-color/50">
            {isSuccess ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-primary-text">Message envoyé !</h3>
                    <p className="mt-2 text-secondary-text max-w-md mx-auto">
                        Merci pour votre message. Sylvie Roche ou Thomas Dubreucq vous recontactera sous 24h à 48h.
                    </p>
                    <button 
                        onClick={() => setIsSuccess(false)} 
                        className="mt-6 inline-flex items-center text-accent hover:text-accent-dark font-medium underline transition-colors"
                    >
                        Envoyer un autre message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1">
                        Nom & Prénom <span className="text-accent">*</span>
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        id="name"
                        placeholder="Ex: Jean Dupont"
                        className={inputBaseClass}
                    />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-primary-text mb-1">
                            E-mail <span className="text-accent">*</span>
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            id="email"
                            placeholder="jean.dupont@email.com"
                            className={inputBaseClass}
                        />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-primary-text mb-1">
                            Téléphone <span className="text-accent">*</span>
                        </label>
                        <input
                            {...register('phone')}
                            type="tel"
                            id="phone"
                            placeholder="06 12 34 56 78"
                            className={inputBaseClass}
                        />
                        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-primary-text mb-1">
                        Motif de votre demande
                    </label>
                    <select
                        {...register('subject')}
                        id="subject"
                        className={inputBaseClass}
                    >
                        <option value="Estimer un bien (Vente)">Estimer un bien (Vente)</option>
                        <option value="Acheter un bien / Déposer un critère">Acheter un bien / Déposer un critère de recherche</option>
                        <option value="Conseil technique / Travaux">Conseil technique / Travaux (Bâtiment)</option>
                        {reference && <option value={`Renseignement bien réf: ${reference}`}>Renseignement sur ce bien (Réf: {reference})</option>}
                        <option value="Autre demande">Autre demande</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary-text mb-1">
                        Votre message <span className="text-accent">*</span>
                    </label>
                    <textarea
                        {...register('message')}
                        id="message"
                        rows={5}
                        placeholder="Décrivez votre projet immobilier, la localisation souhaitée, vos questions..."
                        className={inputBaseClass}
                    ></textarea>
                    {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                </div>

                <div>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}`}
                    >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon message'}
                    </button>
                    <p className="text-xs text-center text-secondary-text mt-3">
                        Vos coordonnées restent strictement confidentielles et ne seront jamais partagées.
                    </p>
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