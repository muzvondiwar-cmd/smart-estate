import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Printer, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { API_URL } from '../config';

const Report = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/properties/${id}/report`);
                setReport(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching report:", err);
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Generating Legal Analysis...</p>
            </div>
        </div>
    );

    if (!report) return (
        <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
            Failed to generate report. Please try again.
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
            {/* Navigation */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link to={`/property/${id}`} className="flex items-center text-gray-600 hover:text-black transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Property
                </Link>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-800 transition font-medium">
                    <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
            </div>

            {/* --- THE OFFICIAL REPORT DOCUMENT --- */}
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-xl rounded-xl border border-gray-200 print:shadow-none print:border-none">

                {/* Header */}
                <div className="border-b-4 border-gray-900 pb-8 mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Due Diligence Report</h1>
                        <p className="text-gray-500 mt-2 font-medium tracking-wide">SmartEstate AI Verification Engine</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Reference ID</div>
                        <div className="font-mono font-bold text-xl text-gray-900">SE-{report.property_id}-2025</div>
                    </div>
                </div>

                {/* Risk Score Section */}
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 mb-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Risk Score</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900">{report.risk_score}</span>
                            <span className="text-xl text-gray-400 font-medium">/100</span>
                        </div>
                        <div className={`text-sm font-bold mt-2 uppercase tracking-wide px-2 py-1 rounded inline-block ${report.risk_score < 30 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {report.risk_score < 30 ? '✅ Low Risk Investment' : '⚠️ Moderate Risk Detected'}
                        </div>
                    </div>
                    <ShieldCheck className={`w-20 h-20 ${report.risk_score < 30 ? 'text-green-200' : 'text-orange-200'}`} />
                </div>

                {/* Legal Checks Grid */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4 uppercase tracking-wider">1. Legal & Regulatory Checks</h3>
                    <div className="grid gap-4">
                        {report.legal_checks.map((item, index) => (
                            <div key={index} className="flex items-start justify-between p-5 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex items-start gap-4">
                                    {item.status === 'PASSED' ?
                                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" /> :
                                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                                    }
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{item.check}</div>
                                        <div className="text-sm text-gray-500 mt-0.5">{item.details}</div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'PASSED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                  {item.status}
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Valuation Section */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4 uppercase tracking-wider">2. AI Valuation Estimate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 rounded-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-gray-50">
                        <div className="p-6 text-center">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Market Value</div>
                            <div className="text-2xl font-black text-gray-900">${report.valuation.estimated_value.toLocaleString()}</div>
                        </div>
                        <div className="p-6 text-center">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Market Trend</div>
                            <div className="text-xl font-bold text-emerald-600">{report.valuation.market_trend}</div>
                        </div>
                        <div className="p-6 text-center">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price / m²</div>
                            <div className="text-xl font-bold text-gray-900">${report.valuation.price_per_sqm.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                {/* Footer disclaimer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-relaxed max-w-2xl mx-auto">
                        This report is generated by Artificial Intelligence based on available digital records.
                        SmartEstate AI does not replace professional legal counsel or physical inspection.
                        © 2025 SmartEstate AI. All rights reserved.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Report;