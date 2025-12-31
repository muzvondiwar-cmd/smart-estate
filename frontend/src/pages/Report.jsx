import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Printer, Download, ArrowLeft, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
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

    if (loading) return <div className="p-12 text-center">Generating Analysis...</div>;
    if (!report) return <div className="p-12 text-center text-red-600">Failed to generate report.</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            {/* Navigation */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
                <Link to={`/property/${id}`} className="flex items-center text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Property
                </Link>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
            </div>

            {/* --- THE OFFICIAL REPORT DOCUMENT --- */}
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-xl rounded-xl border border-gray-200" id="print-area">

                {/* Header */}
                <div className="border-b-2 border-gray-900 pb-6 mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Due Diligence Report</h1>
                        <p className="text-gray-500 mt-1">SmartEstate AI Verification Engine</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Reference ID</div>
                        <div className="font-mono font-bold text-lg">SE-{report.property_id}-2025</div>
                    </div>
                </div>

                {/* Risk Score Section */}
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Overall Risk Score</h3>
                        <div className="text-4xl font-black text-slate-900 mt-1">{report.risk_score}/100</div>
                        <div className={`text-sm font-bold mt-1 ${report.risk_score < 30 ? 'text-green-600' : 'text-orange-500'}`}>
                            {report.risk_score < 30 ? '✅ LOW RISK INVESTMENT' : '⚠️ MODERATE RISK DETECTED'}
                        </div>
                    </div>
                    <ShieldCheck className={`w-16 h-16 ${report.risk_score < 30 ? 'text-green-200' : 'text-orange-200'}`} />
                </div>

                {/* Legal Checks Grid */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-3">1. Legal & Regulatory Checks</h3>
                <div className="grid gap-4 mb-8">
                    {report.legal_checks.map((item, index) => (
                        <div key={index} className="flex items-start justify-between p-4 bg-white border border-gray-100 rounded shadow-sm">
                            <div className="flex items-start gap-3">
                                {item.status === 'PASSED' ?
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> :
                                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                                }
                                <div>
                                    <div className="font-bold text-gray-900">{item.check}</div>
                                    <div className="text-sm text-gray-500">{item.details}</div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'PASSED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {item.status}
              </span>
                        </div>
                    ))}
                </div>

                {/* Valuation Section */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-3">2. AI Valuation Estimate</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Est. Market Value</div>
                        <div className="text-xl font-bold text-gray-900">${report.valuation.estimated_value.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Market Trend</div>
                        <div className="text-xl font-bold text-green-600">{report.valuation.market_trend}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Price / m²</div>
                        <div className="text-xl font-bold text-gray-900">${report.valuation.price_per_sqm.toFixed(2)}</div>
                    </div>
                </div>

                {/* Footer disclaimer */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-400 italic">
                        This report is generated by Artificial Intelligence based on available digital records.
                        SmartEstate AI does not replace legal counsel. Please verify all documents physically.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Report;