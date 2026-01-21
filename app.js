// Salary Benchmark App - For Clinic Owners
document.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('state-select');
    const roleSelect = document.getElementById('role-select');
    const salaryInput = document.getElementById('salary-input');
    const compareBtn = document.getElementById('compare-btn');
    const backBtn = document.getElementById('back-btn');
    const inputSection = document.getElementById('input-section');
    const resultsSection = document.getElementById('results-section');
    const payTypeLabel = document.getElementById('pay-type-label');

    // Toggle buttons
    const toggleAnnual = document.getElementById('toggle-annual');
    const toggleHourly = document.getElementById('toggle-hourly');

    // Email Gate Elements
    const emailGate = document.getElementById('email-gate');
    const emailGateForm = document.getElementById('email-gate-form');
    const blurContainer = document.getElementById('blur-container');
    const userEmailInput = document.getElementById('user-email');

    // National Average cards (preview and unlocked versions)
    const nationalPreview = document.querySelector('.national-preview');
    const nationalUnlocked = document.querySelector('.national-unlocked');

    // Settings elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsClose = document.getElementById('settings-close');
    const copyVariantSelect = document.getElementById('copy-variant');
    const showRangeCheckbox = document.getElementById('show-range');
    const rangeSection = document.getElementById('range-section');

    // Current state
    let currentRole = null;
    let currentState = null;
    let currentSalary = null;
    let currentMode = 'annual'; // 'annual' or 'hourly'

    // Toggle mode handler
    function setMode(mode) {
        currentMode = mode;
        if (mode === 'annual') {
            toggleAnnual.classList.add('active');
            toggleHourly.classList.remove('active');
            payTypeLabel.textContent = "What You're Paying (Annual)";
            salaryInput.placeholder = "65,000";
        } else {
            toggleHourly.classList.add('active');
            toggleAnnual.classList.remove('active');
            payTypeLabel.textContent = "What You're Paying (Hourly)";
            salaryInput.placeholder = "35.00";
        }
        salaryInput.value = '';
        validateForm();
    }

    toggleAnnual.addEventListener('click', () => setMode('annual'));
    toggleHourly.addEventListener('click', () => setMode('hourly'));

    // Check if results are already unlocked
    function checkUnlockStatus() {
        if (localStorage.getItem('flychain_unlocked') === 'true') {
            unlockResults();
        } else {
            lockResults();
        }
    }

    // Lock results (show gate, show preview national, hide unlocked national)
    function lockResults() {
        emailGate.classList.remove('hidden');
        blurContainer.classList.add('blurred');
        nationalPreview.classList.remove('hidden');
        nationalUnlocked.classList.add('hidden');
    }

    // Unlock results (hide gate, hide preview national, show unlocked national)
    function unlockResults() {
        emailGate.classList.add('hidden');
        blurContainer.classList.remove('blurred');
        nationalPreview.classList.add('hidden');
        nationalUnlocked.classList.remove('hidden');
    }

    // Handle email submission
    emailGateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = userEmailInput.value;
        if (email && email.includes('@')) {
            localStorage.setItem('flychain_unlocked', 'true');
            localStorage.setItem('flychain_user_email', email);

            // Animate unlock
            unlockResults();

            // Send to Zapier webhook
            try {
                const stateName = window.STATE_NAMES?.[currentState] || currentState;
                await fetch('https://hooks.zapier.com/hooks/catch/24400971/ug0gnwg/', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        role: currentRole,
                        state: stateName,
                        stateCode: currentState,
                        salary: currentSalary,
                        payMode: currentMode,
                        timestamp: new Date().toISOString(),
                        source: 'salary-benchmark-tool'
                    })
                });
                console.log("Email sent to Zapier:", email);
            } catch (error) {
                console.error("Failed to send to Zapier:", error);
            }
        }
    });

    // CTA copy variants
    const ctaVariants = {
        1: {
            title: '📊 Get Your Custom Salary Benchmark Report',
            text: 'Stop guessing. See exactly what local competitors are paying their RBTs and BCBAs right now.',
            button: 'Get My Report'
        },
        2: {
            title: '📉 Are You Losing Talent to Competitors?',
            text: 'Ensure your offers are competitive without overpaying. We\'ll build a salary strategy based on real-time local market data.',
            button: 'Compare My Rates'
        },
        3: {
            title: '💰 Competitive Pay that Protects Your Margins',
            text: 'Balance attractive salaries with clinic profitability. Get a compensation analysis tailored to your specific region and revenue model.',
            button: 'Analyze My Strategy'
        },
        4: {
            title: '📋 Request a Compensation Audit',
            text: 'Don\'t rely on national averages. Get a deep-dive analysis of how your pay scales stack up against other ABA clinics in your state.',
            button: 'Start Free Audit'
        },
        5: {
            title: '🧠 Make Data-Backed Hiring Decisions',
            text: 'Eliminate the guesswork. Access verified salary benchmarks to confidently set rates for clinical and administrative staff.',
            button: 'See the Data'
        }
    };

    // Settings panel toggle
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });

    settingsClose.addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
    });

    // Copy variant change
    copyVariantSelect.addEventListener('change', () => {
        const variant = ctaVariants[copyVariantSelect.value];
        document.getElementById('cta-title').textContent = variant.title;
        document.getElementById('cta-text').textContent = variant.text;
        document.getElementById('cta-button-text').textContent = variant.button;
    });

    // Range bar toggle
    showRangeCheckbox.addEventListener('change', () => {
        if (showRangeCheckbox.checked) {
            rangeSection.classList.remove('hidden');
        } else {
            rangeSection.classList.add('hidden');
        }
    });

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

    // Salary input formatting
    salaryInput.addEventListener('input', (e) => {
        let value = e.target.value;

        if (currentMode === 'annual') {
            // Remove non-numeric characters for annual
            value = value.replace(/[^0-9]/g, '');
            if (value) {
                value = parseInt(value, 10).toLocaleString('en-US');
            }
        } else {
            // Allow decimals for hourly
            value = value.replace(/[^0-9.]/g, '');
            // Only allow one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
        }

        e.target.value = value;
        validateForm();
    });

    // Validation - state, role, and salary required
    function validateForm() {
        const stateValid = stateSelect.value !== '';
        const roleValid = roleSelect.value !== '';
        const salaryValid = salaryInput.value !== '';
        compareBtn.disabled = !(stateValid && roleValid && salaryValid);
    }

    stateSelect.addEventListener('change', validateForm);
    roleSelect.addEventListener('change', validateForm);

    // Format salary/hourly rate
    function formatAmount(amount) {
        if (currentMode === 'hourly') {
            return '$' + amount.toFixed(2);
        }
        return '$' + Math.round(amount).toLocaleString('en-US');
    }

    // Get salary range using p25 and p75
    function getSalaryRange(stateData, userSalary) {
        const modeData = stateData[currentMode];
        let low = modeData.p25;
        let high = modeData.p75;

        // Extend range to include user's salary with padding
        if (userSalary < low) {
            low = currentMode === 'hourly' ? userSalary * 0.90 : Math.round(userSalary * 0.90);
        }
        if (userSalary > high) {
            high = currentMode === 'hourly' ? userSalary * 1.05 : Math.round(userSalary * 1.05);
        }

        return { low, high };
    }

    // Update display with results
    function updateDisplay() {
        const data = window.SALARY_DATA?.[currentRole];
        if (!data) return;

        const stateData = data.states[currentState];
        const nationalData = data.national;
        const marketRate = stateData[currentMode].p50;
        const range = getSalaryRange(stateData, currentSalary);
        const delta = currentSalary - marketRate;

        // Update verdict card
        const verdictCard = document.getElementById('verdict-card');
        const verdictIcon = document.getElementById('verdict-icon');
        const verdictTitle = document.getElementById('verdict-title');
        const verdictText = document.getElementById('verdict-text');

        verdictCard.classList.remove('above', 'below', 'competitive');

        if (delta > marketRate * 0.1) {
            // More than 10% above market
            verdictCard.classList.add('above');
            verdictIcon.textContent = '📈';
            verdictTitle.textContent = "You're Paying Above Market";
            verdictText.textContent = `You may be leaving ${formatAmount(Math.abs(delta))} on the table compared to local competitors.`;
        } else if (delta < -marketRate * 0.1) {
            // More than 10% below market
            verdictCard.classList.add('below');
            verdictIcon.textContent = '📉';
            verdictTitle.textContent = "You're Paying Below Market";
            verdictText.textContent = `Underpaying by ${formatAmount(Math.abs(delta))} could cause retention issues and higher turnover costs.`;
        } else {
            // Within 10% - competitive
            verdictCard.classList.add('competitive');
            verdictIcon.textContent = '✅';
            verdictTitle.textContent = "You're Paying Competitively";
            verdictText.textContent = `Your ${currentMode === 'hourly' ? 'rate' : 'salary'} aligns with local market rates. Great for retention and cost efficiency.`;
        }

        // Update National Average card (both preview and unlocked versions)
        const natAvg = nationalData[currentMode].p50;
        const natDelta = currentSalary - natAvg;
        const natAvgFormatted = formatAmount(natAvg);
        const natDeltaText = natDelta >= 0
            ? `You're paying ${formatAmount(Math.abs(natDelta))} above the national average.`
            : `You're paying ${formatAmount(Math.abs(natDelta))} below the national average.`;

        // Preview version
        document.getElementById('nat-avg-value').textContent = natAvgFormatted;
        document.getElementById('nat-avg-comparison').textContent = natDeltaText;

        // Unlocked version
        document.getElementById('nat-avg-value-unlocked').textContent = natAvgFormatted;
        document.getElementById('nat-avg-comparison-unlocked').textContent = natDeltaText;

        // Update State Average card
        const stateName = window.STATE_NAMES?.[currentState] || currentState;
        const stateDelta = currentSalary - marketRate;
        document.getElementById('state-avg-label').textContent = `📍 ${stateName} Average`;
        document.getElementById('state-avg-value').textContent = formatAmount(marketRate);
        const stateAvgComparisonEl = document.getElementById('state-avg-comparison');

        if (stateDelta >= 0) {
            stateAvgComparisonEl.textContent = `You're paying ${formatAmount(Math.abs(stateDelta))} above the ${stateName} average.`;
        } else {
            stateAvgComparisonEl.textContent = `You're paying ${formatAmount(Math.abs(stateDelta))} below the ${stateName} average.`;
        }

        // Update comparison values
        document.getElementById('you-pay-value').textContent = formatAmount(currentSalary);
        document.getElementById('market-rate-label').textContent = `${stateName} Market Rate`;
        document.getElementById('market-rate-value').textContent = formatAmount(marketRate);

        // Update "You're Paying" box color to match verdict
        const youPayItem = document.querySelector('.comparison-item.you-pay');
        youPayItem.classList.remove('below', 'above', 'competitive');
        if (delta > marketRate * 0.1) {
            youPayItem.classList.add('above');
        } else if (delta < -marketRate * 0.1) {
            youPayItem.classList.add('below');
        } else {
            youPayItem.classList.add('competitive');
        }

        // Update range bar
        document.getElementById('range-low').textContent = formatAmount(range.low);
        document.getElementById('range-high').textContent = formatAmount(range.high);

        // Position user marker
        const userMarker = document.getElementById('user-marker');
        const rangeSpan = range.high - range.low;
        let position = ((currentSalary - range.low) / rangeSpan) * 100;
        position = Math.max(5, Math.min(95, position)); // Keep marker visible
        userMarker.style.left = `${position}%`;
    }

    // Show results
    compareBtn.addEventListener('click', () => {
        if (compareBtn.disabled) return;

        currentRole = roleSelect.value;
        currentState = stateSelect.value;

        if (currentMode === 'annual') {
            currentSalary = parseInt(salaryInput.value.replace(/,/g, ''), 10);
        } else {
            currentSalary = parseFloat(salaryInput.value);
        }

        const data = window.SALARY_DATA?.[currentRole];
        if (!data) return;

        // Check unlock status whenever results are shown
        checkUnlockStatus();

        // Update display
        updateDisplay();

        // Show results, hide input
        inputSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    // Back button
    backBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    });
});
