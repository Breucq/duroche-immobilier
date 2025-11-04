import React from 'react';

interface ContactFormProps {
    isPage?: boolean;
    reference?: string;
    title?: string;
    subtitle?: string;
}

/**
 * Composant de formulaire de contact.
 * Peut être utilisé comme une section sur une page ou comme le contenu principal
 * d'une page de contact dédiée.
 * Pré-remplit le message si une référence de bien est fournie.
 */
const ContactForm: React.FC<ContactFormProps> = ({ isPage = false, reference, title, subtitle }) => {
    const defaultMessage = reference 
        ? `Bonjour,\n\nJe suis intéressé(e) par le bien portant la référence : ${reference}.\nPourriez-vous me recontacter à ce sujet ?\n\nCordialement,`
        : '';

    const inputBaseClass = "py-3 px-4 block w-full bg-white shadow-sm border-border-color rounded-lg focus:ring-1 focus:ring-accent focus:border-accent";

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
            <form action="https://formspree.io/f/VOTRE_ENDPOINT_UNIQUE" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary-text">Nom & Prénom</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    required
                    className={inputBaseClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-text">E-mail</label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={inputBaseClass}
                  />
                </div>
              </div>
               <div>
                <label htmlFor="phone" className="block text-sm font-medium text-primary-text">Téléphone</label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className={inputBaseClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary-text">Message</label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    defaultValue={defaultMessage}
                    required
                    className={inputBaseClass}
                  ></textarea>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;