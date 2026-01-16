// Salary Benchmark App - For Clinic Owners
document.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('state-select');
    const roleSelect = document.getElementById('role-select');
    const experienceSelect = document.getElementById('experience-select');
    const salaryInput = document.getElementById('salary-input');
    const compareBtn = document.getElementById('compare-btn');
    const backBtn = document.getElementById('back-btn');
    const inputSection = document.getElementById('input-section');
    const resultsSection = document.getElementById('results-section');

    // Email Gate Elements
    const emailGate = document.getElementById('email-gate');
    const emailGateForm = document.getElementById('email-gate-form');
    const blurContainer = document.getElementById('blur-container');
    const userEmailInput = document.getElementById('user-email');

    // National Averages (Benchmark data estimates)
    const NATIONAL_AVERAGES = {
        "BCBA": 85000,
        "RBT": 48000
    };

    // Settings elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsClose = document.getElementById('settings-close');
    const copyVariantSelect = document.getElementById('copy-variant');
    const showRangeCheckbox = document.getElementById('show-range');
    const rangeSection = document.getElementById('range-section');

    // Check if results are already unlocked
    function checkUnlockStatus() {
        if (localStorage.getItem('flychain_unlocked') === 'true') {
            emailGate.classList.add('hidden');
            blurContainer.classList.remove('blurred');
        } else {
            emailGate.classList.remove('hidden');
            blurContainer.classList.add('blurred');
        }
    }

    // Handle email submission
    emailGateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = userEmailInput.value;
        if (email && email.includes('@')) {
            localStorage.setItem('flychain_unlocked', 'true');
            localStorage.setItem('flychain_user_email', email);

            // Animate unlock
            emailGate.classList.add('hidden');
            blurContainer.classList.remove('blurred');

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
                        experienceLevel: currentExperience,
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
    // ... (rest of the variants remain the same)
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

    // Current state
    let currentRole = null;
    let currentState = null;
    let currentExperience = null;
    let currentSalary = null;

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
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            value = parseInt(value, 10).toLocaleString('en-US');
        }
        e.target.value = value;
        validateForm();
    });

    // Validation - all fields required including salary
    function validateForm() {
        const stateValid = stateSelect.value !== '';
        const roleValid = roleSelect.value !== '';
        const expValid = experienceSelect.value !== '';
        const salaryValid = salaryInput.value !== '';
        compareBtn.disabled = !(stateValid && roleValid && expValid && salaryValid);
    }

    stateSelect.addEventListener('change', validateForm);
    roleSelect.addEventListener('change', validateForm);
    experienceSelect.addEventListener('change', validateForm);

    // Format salary
    function formatSalary(amount) {
        return '$' + Math.round(amount).toLocaleString('en-US');
    }

    // Experience level labels
    const expLabels = {
        entry: 'Entry Level',
        early: 'Early Career',
        mid: 'Mid Career',
        experienced: 'Experienced'
    };

    // Calculate salary range - extends dynamically to include user's salary
    function getExperienceRange(baseSalary, userSalary) {
        let low = Math.round(baseSalary * 0.85);
        let high = Math.round(baseSalary * 1.20);

        // Extend range to include user's salary with padding
        if (userSalary < low) {
            low = Math.round(userSalary * 0.90);
        }
        if (userSalary > high) {
            high = Math.round(userSalary * 1.05);
        }

        return { low, high };
    }

    // Update the display for current experience level
    function updateDisplayForExperience(experience) {
        const data = window.SALARY_DATA?.[currentRole];
        if (!data) return;

        const expData = data.experience[experience];
        const marketRate = expData.salary;
        const range = getExperienceRange(marketRate, currentSalary);
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
            verdictText.textContent = `You may be leaving ${formatSalary(Math.abs(delta))} on the table compared to local competitors.`;
        } else if (delta < -marketRate * 0.1) {
            // More than 10% below market
            verdictCard.classList.add('below');
            verdictIcon.textContent = '📉';
            verdictTitle.textContent = "You're Paying Below Market";
            verdictText.textContent = `Underpaying by ${formatSalary(Math.abs(delta))} could cause retention issues and higher turnover costs.`;
        } else {
            // Within 10% - competitive
            verdictCard.classList.add('competitive');
            verdictIcon.textContent = '✅';
            verdictTitle.textContent = "You're Paying Competitively";
            verdictText.textContent = `Your salary aligns with local market rates. Great for retention and cost efficiency.`;
        }

        // Update National Average card
        const natAvg = NATIONAL_AVERAGES[currentRole];
        const natDelta = currentSalary - natAvg;
        document.getElementById('nat-avg-value').textContent = formatSalary(natAvg);
        const natAvgComparisonEl = document.getElementById('nat-avg-comparison');

        if (natDelta >= 0) {
            natAvgComparisonEl.textContent = `You're paying ${formatSalary(Math.abs(natDelta))} above the national average.`;
        } else {
            natAvgComparisonEl.textContent = `You're paying ${formatSalary(Math.abs(natDelta))} below the national average.`;
        }

        // Update State Average card
        const stateName = window.STATE_NAMES?.[currentState] || currentState;
        const stateDelta = currentSalary - marketRate;
        document.getElementById('state-avg-label').textContent = `📍 ${stateName} Average`;
        document.getElementById('state-avg-value').textContent = formatSalary(marketRate);
        const stateAvgComparisonEl = document.getElementById('state-avg-comparison');

        if (stateDelta >= 0) {
            stateAvgComparisonEl.textContent = `You're paying ${formatSalary(Math.abs(stateDelta))} above the ${stateName} average.`;
        } else {
            stateAvgComparisonEl.textContent = `You're paying ${formatSalary(Math.abs(stateDelta))} below the ${stateName} average.`;
        }

        // Update comparison values
        document.getElementById('you-pay-value').textContent = formatSalary(currentSalary);
        document.getElementById('market-rate-label').textContent = `${stateName} Market Rate`;
        document.getElementById('market-rate-value').textContent = formatSalary(marketRate);

        // Update range bar
        document.getElementById('range-low').textContent = formatSalary(range.low);
        document.getElementById('range-high').textContent = formatSalary(range.high);

        // Position user marker
        const userMarker = document.getElementById('user-marker');
        const rangeSpan = range.high - range.low;
        let position = ((currentSalary - range.low) / rangeSpan) * 100;
        position = Math.max(5, Math.min(95, position)); // Keep marker visible
        userMarker.style.left = `${position}%`;

        currentExperience = experience;
    }

    // Show results
    compareBtn.addEventListener('click', () => {
        if (compareBtn.disabled) return;

        currentRole = roleSelect.value;
        currentState = stateSelect.value;
        currentExperience = experienceSelect.value;
        currentSalary = parseInt(salaryInput.value.replace(/,/g, ''), 10);

        const data = window.SALARY_DATA?.[currentRole];
        if (!data) return;

        // Check unlock status whenever results are shown
        checkUnlockStatus();

        // Update experience levels grid
        const exp = data.experience;
        document.getElementById('exp-entry').textContent = formatSalary(exp.entry.salary);
        document.getElementById('exp-early').textContent = formatSalary(exp.early.salary);
        document.getElementById('exp-mid').textContent = formatSalary(exp.mid.salary);
        document.getElementById('exp-experienced').textContent = formatSalary(exp.experienced.salary);

        // Update display for selected experience
        updateDisplayForExperience(currentExperience);

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

