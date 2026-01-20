/**
 * ABA Salary Benchmark Data
 * For BCBA and RBT roles in FL, GA, CA, TX, MA, NJ, NY
 * Based on 2024-2025 industry salary data
 */

const SALARY_DATA = {
    "BCBA": {
        "title": "Board Certified Behavior Analyst",
        "shortTitle": "BCBA",
        "description": "Board Certified Behavior Analysts design and oversee Applied Behavior Analysis (ABA) therapy programs for individuals with autism and other developmental conditions.",
        "national": {
            annual: { p25: 68900, p50: 79100, p75: 90500 },
            hourly: { p25: 33.15, p50: 38.03, p75: 43.53 }
        },
        "states": {
            "CA": {
                annual: { p25: 74100, p50: 85200, p75: 98000 },
                hourly: { p25: 35.61, p50: 40.96, p75: 47.12 }
            },
            "FL": {
                annual: { p25: 67300, p50: 77200, p75: 88100 },
                hourly: { p25: 32.38, p50: 37.10, p75: 42.36 }
            },
            "GA": {
                annual: { p25: 69300, p50: 79300, p75: 90500 },
                hourly: { p25: 33.30, p50: 38.14, p75: 43.52 }
            },
            "MA": {
                annual: { p25: 72700, p50: 82900, p75: 94500 },
                hourly: { p25: 34.94, p50: 39.86, p75: 45.45 }
            },
            "NJ": {
                annual: { p25: 72000, p50: 82500, p75: 94200 },
                hourly: { p25: 34.63, p50: 39.65, p75: 45.31 }
            },
            "NY": {
                annual: { p25: 72400, p50: 83400, p75: 96200 },
                hourly: { p25: 34.81, p50: 40.09, p75: 46.25 }
            },
            "TX": {
                annual: { p25: 69100, p50: 79200, p75: 90600 },
                hourly: { p25: 33.20, p50: 38.09, p75: 43.56 }
            }
        }
    },
    "RBT": {
        "title": "Registered Behavior Technician",
        "shortTitle": "RBT",
        "description": "Registered Behavior Technicians provide direct ABA therapy services under the supervision of a BCBA.",
        "national": {
            annual: { p25: 38500, p50: 43300, p75: 50000 },
            hourly: { p25: 18.49, p50: 20.81, p75: 24.06 }
        },
        "states": {
            "CA": {
                annual: { p25: 41700, p50: 47000, p75: 54500 },
                hourly: { p25: 20.05, p50: 22.61, p75: 26.20 }
            },
            "FL": {
                annual: { p25: 37000, p50: 41700, p75: 48200 },
                hourly: { p25: 17.80, p50: 20.04, p75: 23.16 }
            },
            "GA": {
                annual: { p25: 37300, p50: 41800, p75: 48200 },
                hourly: { p25: 17.93, p50: 20.12, p75: 23.20 }
            },
            "MA": {
                annual: { p25: 42200, p50: 47300, p75: 54400 },
                hourly: { p25: 20.30, p50: 22.74, p75: 26.18 }
            },
            "NJ": {
                annual: { p25: 40200, p50: 45200, p75: 52200 },
                hourly: { p25: 19.33, p50: 21.72, p75: 25.11 }
            },
            "NY": {
                annual: { p25: 39900, p50: 45000, p75: 52300 },
                hourly: { p25: 19.16, p50: 21.63, p75: 25.13 }
            },
            "TX": {
                annual: { p25: 36600, p50: 41100, p75: 47600 },
                hourly: { p25: 17.61, p50: 19.78, p75: 22.87 }
            }
        }
    }
};

// State names for the 7 supported states
const STATE_NAMES = {
    "CA": "California",
    "FL": "Florida",
    "GA": "Georgia",
    "MA": "Massachusetts",
    "NJ": "New Jersey",
    "NY": "New York",
    "TX": "Texas"
};

// Export for use in app.js
window.SALARY_DATA = SALARY_DATA;
window.STATE_NAMES = STATE_NAMES;
