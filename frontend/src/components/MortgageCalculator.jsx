import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, PieChart } from 'lucide-react';

const MortgageCalculator = ({ price }) => {
    // Defaults suitable for Zimbabwe/Regional market (USD mortgages)
    const [loanAmount, setLoanAmount] = useState(price * 0.8); // Default 20% deposit
    const [deposit, setDeposit] = useState(price * 0.2);
    const [interestRate, setInterestRate] = useState(12); // 12% is realistic for some Zim USD loans
    const [years, setYears] = useState(10); // Shorter terms are common
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        // Basic Mortgage Formula: M = P[r(1+r)^n]/[(1+r)^n-1]
        const principal = price - deposit;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = years * 12;

        if (principal <= 0) {
            setMonthlyPayment(0);
            return;
        }

        const x = Math.pow(1 + monthlyRate, numberOfPayments);
        const monthly = (principal * monthlyRate * x) / (x - 1);

        setMonthlyPayment(monthly);
        setLoanAmount(principal);
    }, [price, deposit, interestRate, years]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Affordability Calculator</h3>
            </div>

            <div className="space-y-4">
                {/* Deposit Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deposit / Down Payment ($)</label>
                    <input
                        type="number"
                        value={deposit}
                        onChange={(e) => setDeposit(Number(e.target.value))}
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                    />
                    <div className="text-xs text-right text-gray-400 mt-1">
                        {((deposit / price) * 100).toFixed(1)}% of property price
                    </div>
                </div>

                {/* Interest Rate & Years */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Interest Rate (%)</label>
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loan Term (Years)</label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                        />
                    </div>
                </div>

                {/* Result Area */}
                <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Monthly Repayment:</span>
                        <span className="text-2xl font-black text-blue-900">${monthlyPayment.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                        *Estimated figure. Does not include insurance or bank fees.
                    </p>
                </div>

                {/* Apply Button */}
                <button className="w-full mt-2 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2">
                    <DollarSign className="w-4 h-4" /> Get Pre-Approved
                </button>
            </div>
        </div>
    );
};

export default MortgageCalculator;