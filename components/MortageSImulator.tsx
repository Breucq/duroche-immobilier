import React, { useState, useEffect } from 'react';

interface MortgageSimulatorProps {
    price: number;
}

const MortgageSimulator: React.FC<MortgageSimulatorProps> = ({ price }) => {
    const [amount, setAmount] = useState(price);
    const [contribution, setContribution] = useState(0);
    const [duration, setDuration] = useState(25);
    const [rate, setRate] = useState(3.8);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    useEffect(() => {
        // Formule : M = P * [r(1+r)^n] / [(1+r)^n – 1]
        // P = Montant emprunté (Prix - Apport)
        // r = Taux mensuel (Taux annuel / 12 / 100)
        // n = Nombre de mensualités (Années * 12)
        
        const principal = Math.max(0, amount - contribution);
        
        if (principal === 0) {
            setMonthlyPayment(0);
            return;
        }

        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = duration * 12;

        if (rate === 0) {
            setMonthlyPayment(principal / numberOfPayments);
        } else {
            const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            setMonthlyPayment(payment);
        }

    }, [amount, contribution, duration, rate]);

    return (
        <div className="bg-background-alt p-6 rounded-xl border border-border-color/50 mt-8">
            <h3 className="text-xl font-heading font-bold text-primary-text mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 36v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Simulateur de financement
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1">Montant du bien</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text">€</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1">Votre apport</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={contribution} 
                                onChange={(e) => setContribution(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text">€</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">Durée</label>
                            <div className="relative">
                                <select 
                                    value={duration} 
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none appearance-none"
                                >
                                    {[10, 15, 20, 25, 30].map(y => <option key={y} value={y}>{y} ans</option>)}
                                </select>
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">▼</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">Taux</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    step="0.05"
                                    value={rate} 
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-border-color flex flex-col justify-center items-center text-center">
                    <p className="text-secondary-text mb-2">Mensualité estimée (hors assurance)</p>
                    <p className="text-4xl font-bold font-heading text-accent mb-2">
                        {formatCurrency(monthlyPayment)}<span className="text-lg text-secondary-text font-normal"> /mois</span>
                    </p>
                    <p className="text-xs text-secondary-text mt-4 bg-gray-50 p-2 rounded">
                        *Cette simulation est non contractuelle et donnée à titre indicatif. Taux estimatif moyen sur {duration} ans.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MortgageSimulator;