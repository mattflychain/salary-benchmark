/**
 * ABA Salary Benchmark Data
 * For BCBA and RBT roles in FL, CA, TX, NY, NJ
 * Based on 2024-2025 industry salary data
 */

const SALARY_DATA = {
    "BCBA": {
        "title": "Board Certified Behavior Analyst",
        "shortTitle": "BCBA",
        "description": "Board Certified Behavior Analysts design and oversee Applied Behavior Analysis (ABA) therapy programs for individuals with autism and other developmental conditions. They conduct assessments, develop treatment plans, supervise RBTs and other staff, train caregivers, and ensure quality of services.",
        "percentiles": {
            "CA": { p10: 70000, p25: 73000, p50: 88000, p75: 100000, p90: 110000 },
            "TX": { p10: 63000, p25: 69000, p50: 83000, p75: 95000, p90: 105000 },
            "FL": { p10: 58000, p25: 60000, p50: 67000, p75: 82000, p90: 95000 },
            "NY": { p10: 75000, p25: 81000, p50: 98000, p75: 108000, p90: 118000 },
            "NJ": { p10: 70000, p25: 78000, p50: 99000, p75: 115000, p90: 130000 }
        },
        "experience": {
            "entry": { salary: 65000, label: "Entry Level", years: "<1 year" },
            "early": { salary: 72000, label: "Early Career", years: "1-4 years" },
            "mid": { salary: 85000, label: "Mid Career", years: "5-9 years" },
            "experienced": { salary: 98000, label: "Experienced", years: "10+ years" }
        }
    },
    "RBT": {
        "title": "Registered Behavior Technician",
        "shortTitle": "RBT",
        "description": "Registered Behavior Technicians provide direct ABA therapy services under the supervision of a BCBA. They implement behavior intervention plans, collect data on client progress, and work one-on-one with individuals with autism and developmental disabilities in homes, schools, and clinical settings.",
        "percentiles": {
            "CA": { p10: 44000, p25: 48000, p50: 55000, p75: 62000, p90: 70000 },
            "TX": { p10: 37000, p25: 40000, p50: 46000, p75: 53000, p90: 60000 },
            "FL": { p10: 34000, p25: 36000, p50: 42000, p75: 48000, p90: 54000 },
            "NY": { p10: 49000, p25: 53000, p50: 62000, p75: 72000, p90: 80000 },
            "NJ": { p10: 46000, p25: 50000, p50: 56000, p75: 65000, p90: 72000 }
        },
        "experience": {
            "entry": { salary: 38000, label: "Entry Level", years: "<1 year" },
            "early": { salary: 44000, label: "Early Career", years: "1-4 years" },
            "mid": { salary: 52000, label: "Mid Career", years: "5-9 years" },
            "experienced": { salary: 62000, label: "Experienced", years: "10+ years" }
        }
    }
};

// State names for the 5 supported states
const STATE_NAMES = {
    "CA": "California",
    "FL": "Florida",
    "NJ": "New Jersey",
    "NY": "New York",
    "TX": "Texas"
};

// Export for use in app.js
window.SALARY_DATA = SALARY_DATA;
window.STATE_NAMES = STATE_NAMES;
