// CPT Checker App
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/24400971/ugkyxst/';

document.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('state-select');
    const cptInput = document.getElementById('cpt-code');
    const billingInput = document.getElementById('billing-amount');
    const cptDescription = document.getElementById('cpt-description');
    const compareBtn = document.getElementById('compare-btn');
    const resultsSection = document.getElementById('results');
    const inputCard = document.querySelector('.input-card');
    const resetBtn = document.getElementById('reset-btn');

    // Email gate elements
    const emailModal = document.getElementById('email-modal');
    const emailForm = document.getElementById('email-form');
    const emailInput = document.getElementById('email-input');

    // Populate state dropdown
    if (window.STATE_NAMES) {
        Object.entries(window.STATE_NAMES)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .forEach(([code, name]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                stateSelect.appendChild(option);
            });
    }

    let selectedState = null;
    let selectedCpt = null;

    // Email gate: Check if user has submitted email
    function hasUserEmail() {
        return localStorage.getItem('flychain_user_email') !== null;
    }

    // Email gate: Get analysis count
    function getAnalysisCount() {
        return parseInt(localStorage.getItem('flychain_analysis_count') || '0', 10);
    }

    // Email gate: Increment analysis count
    function incrementAnalysisCount() {
        const count = getAnalysisCount() + 1;
        localStorage.setItem('flychain_analysis_count', count.toString());
        return count;
    }

    // Send data to Zapier
    async function sendToZapier(email) {
        if (!ZAPIER_WEBHOOK_URL || ZAPIER_WEBHOOK_URL.includes('REPLACE_WITH_YOUR')) {
            console.warn('Zapier Webhook URL not configured.');
            return;
        }

        const payload = {
            email: email,
            timestamp: new Date().toISOString(),
            source: 'ABA Rate Benchmark Tool',
            state: selectedState,
            cptCode: selectedCpt,
            billingRate: billingInput.value,
            analysisCount: getAnalysisCount()
        };

        try {
            await fetch(ZAPIER_WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors', // Use no-cors for simple webhooks if needed, though cors is better if Zapier supports it
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            console.log('Lead sent to Zapier successfully.');
        } catch (error) {
            console.error('Error sending lead to Zapier:', error);
        }
    }

    // Format currency
    function formatCurrency(amount) {
        return '$' + parseFloat(amount).toFixed(2);
    }

    // Validate form and enable button
    function validateForm() {
        const stateValid = selectedState !== null;
        const cptValid = selectedCpt !== null;
        const billingValid = parseFloat(billingInput.value) > 0;
        compareBtn.disabled = !(stateValid && cptValid && billingValid);
    }

    // State select handler
    stateSelect.addEventListener('change', (e) => {
        selectedState = e.target.value;
        if (selectedState) {
            stateSelect.classList.add('valid');
        } else {
            stateSelect.classList.remove('valid');
        }
        validateForm();
    });

    // CPT code select handler
    cptInput.addEventListener('change', (e) => {
        selectedCpt = e.target.value;
        if (selectedCpt) {
            cptDescription.textContent = ABA_DATA[selectedCpt].description;
            cptDescription.classList.add('visible');
            cptInput.classList.add('valid');
        } else {
            cptDescription.classList.remove('visible');
            cptInput.classList.remove('valid');
        }
        validateForm();
    });

    // Billing amount input handler
    billingInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts[1] && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }
        e.target.value = value;
        validateForm();
    });

    // Compare button handler
    compareBtn.addEventListener('click', () => {
        if (compareBtn.disabled) return;

        // Email gate: if second+ analysis and no email, show modal
        const analysisCount = getAnalysisCount();
        if (analysisCount >= 1 && !hasUserEmail()) {
            emailModal.classList.remove('hidden');
            return;
        }

        incrementAnalysisCount();
        showResults();
    });

    // Email form submission handler
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (email) {
            localStorage.setItem('flychain_user_email', email);
            emailModal.classList.add('hidden');
            sendToZapier(email); // Trigger Zapier push
            incrementAnalysisCount();
            showResults();
        }
    });

    function showResults() {
        const userRate = parseFloat(billingInput.value);
        const stateAvg = ABA_DATA[selectedCpt].stateAverages[selectedState] || 15;
        const stateName = STATE_NAMES[selectedState] || selectedState;

        // Update results
        document.getElementById('results-state').textContent = stateName;
        document.getElementById('your-rate').textContent = formatCurrency(userRate);
        document.getElementById('state-avg-value').textContent = formatCurrency(stateAvg);

        // Calculate gauge position - ABA rates are tighter usually, so let's adjust max
        const maxGauge = stateAvg * 1.5;
        const position = Math.min(Math.max((userRate / maxGauge) * 100, 2), 98);
        const marker = document.getElementById('gauge-marker');
        const markerEmoji = document.getElementById('marker-emoji');

        document.getElementById('gauge-max').textContent = formatCurrency(maxGauge);
        document.getElementById('gauge-avg').textContent = `Avg: ${formatCurrency(stateAvg)}`;

        // Animate gauge
        setTimeout(() => {
            marker.style.left = position + '%';
        }, 100);

        // Update insight
        const diff = userRate - stateAvg;
        const diffPercent = ((diff / stateAvg) * 100).toFixed(0);
        const insightCard = document.getElementById('insight-card');
        const insightIcon = document.getElementById('insight-icon');
        const insightTitle = document.getElementById('insight-title');
        const insightText = document.getElementById('insight-text');

        // Get CTA elements
        const flychainCta = document.getElementById('flychain-cta');
        const ctaHeadline = document.getElementById('cta-headline');
        const ctaSubtext = document.getElementById('cta-subtext');
        const yourRateCard = document.querySelector('.comparison-card.your-rate');

        insightCard.classList.remove('above', 'below', 'on-target');
        flychainCta.classList.remove('top-performer', 'needs-help');
        yourRateCard.classList.remove('above', 'below', 'on-target');

        if (diff > stateAvg * 0.05) {
            // Above average
            insightCard.classList.add('above');
            yourRateCard.classList.add('above');
            insightIcon.textContent = '🚀';
            insightTitle.textContent = 'Optimized Performance';
            insightText.textContent = `Your rate is ${formatCurrency(Math.abs(diff))} (+${Math.abs(diffPercent)}%) above the ${stateName} benchmark for this service.`;

            // Emoji for marker - gem for top agencies
            markerEmoji.textContent = '💎';

            // CTA for high billers
            flychainCta.classList.add('top-performer');
            ctaHeadline.textContent = "🚀 Leading rates deserve leading operations.";
            ctaSubtext.textContent = "Top-performing agencies use Flychain's healthcare-specific accounting and CFO tools to protect their margins and automate financial reporting.";

        } else if (diff < -stateAvg * 0.05) {
            // Below average
            insightCard.classList.add('below');
            yourRateCard.classList.add('below');
            insightIcon.textContent = '📉';
            insightTitle.textContent = 'Revenue Opportunity';
            insightText.textContent = `You're receiving ${formatCurrency(Math.abs(diff))} (${diffPercent}%) less than the ${stateName} benchmark. There may be room for negotiation.`;

            // Emoji for marker - warning for low billers
            markerEmoji.textContent = '⚠️';

            // CTA for low billers - most aggressive
            flychainCta.classList.add('needs-help');
            ctaHeadline.textContent = `📊 Unlock higher reimbursement rates`;
            ctaSubtext.textContent = `Flychain's CFO Intelligence tools show you exactly where you're underpaid - so you can negotiate with real payer data.`;

        } else {
            // Right on target
            insightCard.classList.add('on-target');
            yourRateCard.classList.add('on-target');
            insightIcon.textContent = '✅';
            insightTitle.textContent = 'Market Efficient';
            insightText.textContent = `Your contracted rate is within 5% of the ${stateName} industry benchmark. Your reimbursement rates are aligned with market benchmarks.`;

            // Emoji for marker - check for on target
            markerEmoji.textContent = '🎯';

            // CTA for average billers
            ctaHeadline.textContent = "💡 Great rates. How's your cash flow?";
            ctaSubtext.textContent = "Even with competitive rates, generic accounting can mask inefficiencies. Flychain provides healthcare-specific financial clarity to keep your practice thriving.";
        }

        // Show results, hide input
        inputCard.style.display = 'none';
        resultsSection.classList.remove('hidden');
    }

    // Reset button handler
    resetBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        inputCard.style.display = 'flex';

        // Reset form
        stateSelect.value = '';
        billingInput.value = '';

        cptDescription.textContent = 'Rates vary by carrier; showing state-level benchmarks.';
        stateSelect.classList.remove('valid');
        cptInput.classList.remove('valid', 'invalid');
        selectedState = null;
        selectedCpt = null;
        compareBtn.disabled = true;

        // Reset gauge
        document.getElementById('gauge-marker').style.left = '50%';
    });
});
