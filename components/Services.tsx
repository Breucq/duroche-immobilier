import React from 'react';
import type { Service } from '../types';
import { ServiceIconComponent } from './ServiceIcons';

/**
 * Composant carte pour afficher un service individuel.
 * @param {{ service: Service }} props - Le service à afficher.
 */
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-border-color/50">
    <div className="mb-4"><ServiceIconComponent iconName={service.icon} /></div>
    <h3 className="text-xl font-bold font-heading text-primary-text mb-2">{service.title}</h3>
    <p className="text-secondary-text">{service.description}</p>
  </div>
);

interface ServicesProps {
    title: string;
    subtitle: string;
    services: Service[];
}

/**
 * Section affichant une liste de services proposés.
 * Utilise le composant ServiceCard pour chaque service.
 */
const Services: React.FC<ServicesProps> = ({ title, subtitle, services }) => {
  return (
    <section id="services" className="py-24 bg-background-alt mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service._key} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;