import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, AlertTriangle, CheckCircle, Download, ArrowLeft, Printer, FileText, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { API_URL } from '../config';

// --- 📄 PRE-GENERATED DUMMY REPORTS ---
const DUMMY_REPORTS = {
    'dummy-1': {
        generated_at: new Date().toISOString().split('T')[0],
        risk_score: 12,
        valuation: {
            estimated_value: 465000,
            market_trend: "Rising (+8% this year)",
            price_per_sqm: 225,
            confidence: "High (95%)"
        },
        legal_checks: [
            { check: "Title Deed Authenticity", status: "PASSED", details: "Deed #452/2019 matches Deeds Registry records." },
            { check: "Encumbrances / Liens", status: "PASSED", details: "No outstanding mortgages or caveats found." },
            { check: "Seller Identity", status: "PASSED", details: "Biometric match verified against National ID database." },
            { check: "Zoning Regulations", status: "PASSED", details: "Property is correctly zoned for Residential use." },
            { check: "Municipal Rates", status: "WARNING", details: "Minor outstanding balance of $120 detected (Current)." }
        ],
        history: [
            { year: 2023, price: 420000, event: "Market Valuation" },
            { year: 2019, price: 380000, event: "Last Sold" },
            { year: 2015, price: 350000, event: "Sold" }
        ],
        ai_summary: "This property represents a highly secure investment. The title deeds are clean, and the seller has been fully verified. The price is slightly below the suburb average, presenting a good buying opportunity. The minor municipal debt is negligible and easily resolvable."
    },
    'dummy-2': {
        generated_at: new Date().toISOString().split('T')[0],
        risk_score: 8,
        valuation: {
            estimated_value: 125000,
            market_trend: "Stable (+2% this year)",
            price_per_sqm: 800,
            confidence: "Very High (98%)"
        },
        legal_checks: [
            { check: "Title Deed Authenticity", status: "PASSED", details: "Sectional Title Deed verified." },
            { check: "Encumbrances", status: "PASSED", details: "Clear." },
            { check: "Seller Identity", status: "PASSED", details: "Verified." },
            { check: "Levies", status: "PASSED", details: "Body Corporate levies are up to date." }
        ],
        history: [],
        ai_summary: "A pristine sectional title unit. No legal risks detected. Ideal for rental income or first-time buyers."
    },
    'dummy-3': {
        generated_at: new Date().toISOString().split('T')[0],
        risk_score: 45,
        valuation: {
            estimated_value: 80000,
            market_trend: "Flat (0% this year)",
            price_per_sqm: 66,
            confidence: "Moderate (75%)"
        },
        legal_checks: [
            { check: "Title Deed Authenticity", status: "PASSED", details: "Deed exists but is an older paper copy (pre-digitization)." },
            { check: "Encumbrances", status: "WARNING", details: "Caveat found from 2018 (Status unclear)." },
            { check: "Seller Identity", status: "PASSED", details: "Verified." },
            { check: "Boundaries", status: "CRITICAL", details: "Potential boundary dispute with neighbor recorded in 2020." }
        ],
        history: [
            { year: 2010, price: 75000, event: "Inheritance Transfer" }
        ],
        ai_summary: "CAUTION ADVISED: While the seller is verified, there is a historical caveat and a boundary dispute that must be resolved before purchase. We recommend a full physical survey and legal consultation."
    },

    'dummy-6': {
        generated_at: new Date().toISOString().split('T')[0],
        risk_score: 42,
        valuation: {
            estimated_value: 34000,
            market_trend: "Rising (+5% this year)",
            price_per_sqm: 116,
            confidence: "High (90%)"
        },
        legal_checks: [
            { check: "Ownership Status", status: "WARNING", details: "Property is on Council Cession (No Title Deed yet). Transfer requires Council approval." },
            { check: "Utility Bills", status: "PASSED", details: "City of Harare rates are up to date." },
            { check: "Seller Identity", status: "PASSED", details: "Seller ID matches Cession papers." },
            { check: "Soil Conditions", status: "WARNING", details: "Area known for black cotton soil; special foundation checks recommended." }
        ],
        history: [
            { year: 2018, price: 28000, event: "Cession Transfer" }
        ],
        ai_summary: "A fair value property, but the buyer must understand the Cession transfer process. The risk score is elevated solely due to the lack of a full Title Deed, which is common in this area. Ensure the Council transfer fees are factored into your budget."
    },
    'dummy-7': {
        generated_at: new Date().toISOString().split('T')[0],
        risk_score: 65,
        valuation: {
            estimated_value: 42000,
            market_trend: "Stable",
            price_per_sqm: 225,
            confidence: "Moderate (80%)"
        },
        legal_checks: [
            { check: "Title Deed", status: "CRITICAL", details: "Title is currently in a Deceased Estate name. Executor consent required." },
            { check: "Building Plans", status: "WARNING", details: "Cottage extension does not appear on approved municipal plans." },
            { check: "Encumbrances", status: "PASSED", details: "No caveats found." },
            { check: "Tenancy", status: "WARNING", details: "Existing tenants have no written lease agreement." }
        ],
        history: [
            { year: 1995, price: 15000, event: "Original Purchase" }
        ],
        ai_summary: "HIGH RISK: This property is part of a Deceased Estate. Do NOT pay any deposit until the Executor has signed the Sale Agreement and the Master of High Court has issued consent. The unapproved cottage may also attract penalties from the City Council."
    }
};

const Report = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            // 1. SIMULATE AI PROCESSING DELAY (Makes it feel real)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 2. CHECK FOR DUMMY ID
            if (DUMMY_REPORTS[id]) {
                setData({ ...DUMMY_REPORTS[id], property_id: id });
                setLoading(false);
                return;
            }

            // 3. FETCH REAL DATA
            try {
                const response = await axios.get(`${API_URL}/api/v1/properties/${id}/report`);
                setData(response.data);
            } catch (err) {
                console.error("Report Error:", err);
                setError("Could not generate report. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
            <h2 className="text-xl font-bold text-gray-800 animate-pulse">Generating Due Diligence Report...</h2>
            <p className="text-gray-500 mt-2">Analyzing Title Deeds • Checking Court Records • Valuing Market Data</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to={`/property/${id}`} className="text-blue-600 hover:underline font-bold">Return to Property</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 print:bg-white print:p-0">

            {/* --- FLOATING HEADER (Hidden on Print) --- */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <Link to={`/property/${id}`} className="flex items-center text-gray-600 hover:text-blue-600 font-bold transition">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Listing
                </Link>
                <button onClick={() => window.print()} className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-lg">
                    <Printer className="w-4 h-4" /> Print PDF
                </button>
            </div>

            {/* --- REPORT DOCUMENT PAGE --- */}
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full">

                {/* DOCUMENT HEADER */}
                <div className="bg-blue-900 text-white p-8 md:p-12 border-b-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2 opacity-80">
                                <ShieldCheck className="w-6 h-6" />
                                <span className="font-mono tracking-widest uppercase text-sm">Official SmartEstate Report</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black mb-2">Due Diligence Analysis</h1>
                            <p className="text-blue-200">Ref: #{id.toUpperCase()} • Generated: {data.generated_at}</p>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-5xl font-black">{data.risk_score}</div>
                            <div className="text-sm font-bold opacity-80 uppercase tracking-wider">Risk Score</div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-12">

                    {/* 1. EXECUTIVE SUMMARY */}
                    <section>
                        <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Executive Summary
                        </h3>
                        <div className={`p-6 rounded-lg border-l-4 ${data.risk_score < 30 ? 'bg-emerald-50 border-emerald-500' : 'bg-orange-50 border-orange-500'}`}>
                            <h4 className={`font-bold text-lg mb-2 ${data.risk_score < 30 ? 'text-emerald-800' : 'text-orange-800'}`}>
                                {data.risk_score < 30 ? 'Safe Investment Verified' : 'Caution Recommended'}
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                                {data.ai_summary || "Automated analysis complete. Review the specific checks below for details."}
                            </p>
                        </div>
                    </section>

                    {/* 2. MARKET VALUATION */}
                    <section>
                        <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Valuation & Market
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Estimated Value</div>
                                <div className="text-2xl font-black text-gray-900">
                                    ${data.valuation?.estimated_value?.toLocaleString() || "N/A"}
                                </div>
                                <div className="text-green-600 text-xs font-bold mt-2 flex items-center">
                                    <Activity className="w-3 h-3 mr-1" /> AI Confidence: {data.valuation?.confidence || "N/A"}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Market Trend</div>
                                <div className="text-lg font-bold text-blue-600">
                                    {data.valuation?.market_trend || "Stable"}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Based on last 12 months data</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Price / sqm</div>
                                <div className="text-lg font-bold text-gray-900">
                                    ${data.valuation?.price_per_sqm || 0}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Suburb Avg: ${(data.valuation?.price_per_sqm * 1.1).toFixed(0)}</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. LEGAL CHECKS TABLE */}
                    <section>
                        <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Legal Due Diligence
                        </h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Check Type</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Details / Findings</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {data.legal_checks?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-4 font-medium text-gray-900">{item.check}</td>
                                        <td className="p-4">
                                            {item.status === 'PASSED' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Passed</span>}
                                            {item.status === 'WARNING' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1"/> Warning</span>}
                                            {item.status === 'CRITICAL' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1"/> Critical</span>}
                                        </td>
                                        <td className="p-4 text-gray-600">{item.details}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <div className="border-t border-gray-100 pt-8 mt-12 text-center text-xs text-gray-400">
                        <p className="mb-2">This report is generated by SmartEstate AI (Prototype v0.1). Information is based on available public records and AI estimates.</p>
                        <p>Generated ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} • Not a legal guarantee.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Report;