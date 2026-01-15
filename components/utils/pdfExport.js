import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/* PASTE FULL BASE64 STRING HERE */
const LOGO_BASE64 = "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"

/* ---------------------------------- */
/* EXPORT FUNCTION                     */
/* ---------------------------------- */
export async function exportPdf(html, fileName = "report.pdf") {
    const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: fileName,
        });
    }
}


export const currentMonthTemplate = ({
    month,
    transactions = [],
    income = 0,
    expense = 0,
    borrow = 0,
    balance = 0,
    currency = "Rs."
}) => {
    const formatCurrency = (v) =>
        `${currency} ${Number(v || 0).toLocaleString()}`;

    const rows = transactions.map((t, i) => {
        const d = new Date(t.date);

        let amountCell = "";
        if (t.type === "borrow") {
            const totalBorrow = Number(t.amount || 0);
            const paid = Number(t.paid || 0);
            const remaining = totalBorrow - paid;
            amountCell = `
                <div class="borrow">
    <div class="borrow-total">${formatCurrency(totalBorrow)}</div>
    <div class="borrow-paid">Paid: ${formatCurrency(paid)}</div>
    <div class="borrow-remaining">Remaining: ${formatCurrency(remaining)}</div>
</div>

            `;
        } else {
            amountCell = `
                <span class="${t.type}">
                    ${t.type === "income" ? "+" : ""}${formatCurrency(t.amount)}
                </span>
            `;
        }

        return `
        <tr>
            <td>${i + 1}</td>

            <td>
                <div class="date-main">${d.toLocaleDateString()}</div>
                <div class="date-sub">${d.toLocaleTimeString()}</div>
            </td>

            <td>${t.title}</td>
            <td class="subtitle">${t.subtitle || "-"}</td>
            <td>${amountCell}</td>
            <td class="type">${t.type.toUpperCase()}</td>
        </tr>
        `;
    }).join("");

    return `
    <html>
    <head>
        <style>
            @page { margin: 24px; margin-bottom: 80px; }
            body { font-family: Arial; color: #111; }
            h1 { margin-bottom: 16px; }

            .balance { background: #111827; color: white; padding: 14px; font-size: 18px; font-weight: bold; text-align: center; border-radius: 6px; }
            .stats { display: flex; gap: 10px; margin-top: 10px; font-size: 13px; }
            .stat-box { flex: 1; padding: 12px; border-radius: 6px; text-align: center; font-weight: bold; }
            .stat-income { background: #dcfce7; color: #166534; }
            .stat-expense { background: #fee2e2; color: #991b1b; }
            .stat-borrow { background: #ffedd5; color: #9a3412; }
            .borrow-total {
    font-weight: bold;
    font-size: 12px;
}

.borrow-paid {
    color: green;
    font-size: 8px;
}

.borrow-remaining {
    color: red;
    font-size: 8px;
}

            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
            th { background: #f9fafb; }

            .income { color: green; font-weight: bold; }
            .expense { color: red; font-weight: bold; }
            .borrow { color: orange; font-weight: bold; }

            .date-main { font-weight: bold; font-size: 12px; }
            .date-sub { font-size: 10px; color: #555; }
            .subtitle { color: #374151; font-size: 11px; }

            .type { font-weight: bold; text-transform: uppercase; text-align: center; padding: 4px 6px; border-radius: 4px; font-size: 11px; }

            footer { position: fixed; bottom: 24px; left: 24px; right: 24px; font-size: 11px; display: flex; justify-content: space-between; align-items: center; }
            .page-number::before { content: "Page " counter(page) " of " counter(pages); }
            .footer-logo { height: 26px; }
        </style>
    </head>

    <body>
        <h1>${month} – Current Month Report</h1>

        <div class="balance">Total Balance: ${formatCurrency(balance)}</div>

        <div class="stats">
            <div class="stat-box stat-income">Income<br />${formatCurrency(income)}</div>
            <div class="stat-box stat-expense">Expense<br />${formatCurrency(expense)}</div>
            <div class="stat-box stat-borrow">Borrow<br />${formatCurrency(borrow)}</div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Date & Time</th>
                    <th>Title</th>
                    <th>Subtitle</th>
                    <th>Amount</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>

        <footer>
            <div class="page-number"></div>
            <img src="data:image/png;base64,${LOGO_BASE64}" class="footer-logo" />
        </footer>
    </body>
    </html>
    `;
};



/* -------------------------------------------------- */
/* ALL CLOSED MONTHS PDF                               */
/* -------------------------------------------------- */
export const allClosedMonthsTemplate = ({ months = [], currency = "Rs." }) => {
    const formatCurrency = (v) =>
        `${currency} ${Number(v || 0).toLocaleString()}`;

    const totalIncome = months.reduce((s, m) => s + (m.income || 0), 0);
    const totalExpense = months.reduce((s, m) => s + (m.expense || 0), 0);
    const totalBorrow = months.reduce((s, m) => s + (m.borrow || 0), 0);
    const grandBalance = totalIncome - totalExpense;

    const rows = months
        .map((m, i) => {
            const balance = (m.income || 0) - (m.expense || 0);
            return `
                <tr>
                    <td>${m.month}</td>
                    <td class="income">${formatCurrency(m.income)}</td>
                    <td class="expense">${formatCurrency(m.expense)}</td>
                    <td class="borrow">${formatCurrency(m.borrow)}</td>
                    <td class="balance">${formatCurrency(balance)}</td>
                </tr>
            `;
        })
        .join("");

    return `
    <html>
    <head>
        <style>
            @page {
                margin: 24px;
                margin-bottom: 80px;
            }

            body {
                font-family: Arial;
                color: #111;
            }

            h1 {
                margin-bottom: 16px;
            }

            /* GRAND BALANCE */
            .grand-balance {
                background: #111827;
                color: #fff;
                padding: 14px;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                border-radius: 6px;
            }

            /* STATS */
            .stats {
                display: flex;
                gap: 10px;
                margin-top: 10px;
                font-size: 13px;
            }

            .stat-box {
                flex: 1;
                padding: 12px;
                border-radius: 6px;
                text-align: center;
                font-weight: bold;
            }

            .stat-income {
                background: #dcfce7;
                color: #166534;
            }

            .stat-expense {
                background: #fee2e2;
                color: #991b1b;
            }

            .stat-borrow {
                background: #ffedd5;
                color: #9a3412;
            }

            /* TABLE */
            h2 {
                margin-top: 24px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 12px;
            }

            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }

            th {
                background: #f9fafb;
            }

            .income { color: green; font-weight: bold; }
            .expense { color: red; font-weight: bold; }
            .borrow { color: orange; font-weight: bold; }
            .balance { font-weight: bold; }

            /* FOOTER */
            footer {
                position: fixed;
                bottom: 24px;
                left: 24px;
                right: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
            }

            .page-number::before {
                content: "Page " counter(page) " of " counter(pages);
            }

            .footer-logo {
                height: 26px;
            }
        </style>
    </head>

    <body>

        <!-- SUMMARY HEADING -->
        <h1>Closed Months Summary</h1>

        <!-- GRAND BALANCE -->
        <div class="grand-balance">
            Grand Balance: ${formatCurrency(grandBalance)}
        </div>

        <!-- TOTAL STATS -->
        <div class="stats">
            <div class="stat-box stat-income">
                Total Income<br />
                ${formatCurrency(totalIncome)}
            </div>

            <div class="stat-box stat-expense">
                Total Expense<br />
                ${formatCurrency(totalExpense)}
            </div>

            <div class="stat-box stat-borrow">
                Total Borrow<br />
                ${formatCurrency(totalBorrow)}
            </div>
        </div>

        <!-- TABLE HEADING -->
        <h2>Closed Months Transaction List</h2>

        <!-- TABLE -->
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Expense</th>
                    <th>Borrow</th>
                    <th>Total Balance</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>

        <!-- FOOTER -->
        <footer>
            <div class="page-number"></div>
            <img
                src="data:image/png;base64,${LOGO_BASE64}"
                class="footer-logo"
            />
        </footer>

    </body>
    </html>
    `;
};


export const exportClosedMonthPDF = async ({
    month,
    transactions = [],
    income = 0,
    expense = 0,
    borrow = 0,
    balance = 0,
    currency = "Rs."
}) => {
    try {
        const formatCurrency = (v) =>
            `${currency} ${Number(v || 0).toLocaleString()}`;

        const rows = transactions
            .map((t, i) => {
                const d = new Date(t.date);
                return `
                <tr>
                    <td>${i + 1}</td>
                    <td>${d.toLocaleDateString()} ${d.toLocaleTimeString()}</td>
                    <td>${t.title}</td>
                    <td class="amount ${t.type}">
                        ${t.type === "income" ? "+" : ""}${formatCurrency(t.amount)}
                    </td>
                    <td class="${t.type}">${t.type}</td>
                </tr>
                `;
            })
            .join("");

        const html = `
        <html>
        <head>
            <style>
    @page {
        margin: 24px;
        margin-bottom: 80px; /* IMPORTANT: space for footer */
    }

    body {
        font-family: Arial;
        color: #111;
    }

    h1 {
        margin-bottom: 16px;
    }

    .balance {
        background: #111827;
        color: white;
        padding: 14px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        border-radius: 6px;
    }

    .stats {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    font-size: 13px;
}

.stat-box {
    flex: 1;
    padding: 12px;
    border-radius: 6px;
    color: #111;
    text-align: center;
    font-weight: bold;
}

.stat-income {
    background: #dcfce7; /* light green */
    color: #166534;
}

.stat-expense {
    background: #fee2e2; /* light red */
    color: #991b1b;
}

.stat-borrow {
    background: #ffedd5; /* light orange */
    color: #9a3412;
}


    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        font-size: 12px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background: #f9fafb;
    }

    .income { color: green; font-weight: bold; }
    .expense { color: red; font-weight: bold; }
    .borrow { color: orange; font-weight: bold; }

    /* FOOTER */
    footer {
        position: fixed;
        bottom: 24px; /* INSIDE PAGE */
        left: 24px;
        right: 24px;
        font-size: 11px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .page-number::before {
        content: "Page " counter(page) " of " counter(pages);
    }

    .footer-logo {
        height: 26px;
    }
</style>

        </head>

        <body>

            <!-- HEADING -->
            <h1>${month} – Closed Month Report</h1>

            <!-- TOTAL BALANCE -->
            <div class="balance">
                Total Balance: ${formatCurrency(balance)}
            </div>

            <!-- STATS ROW -->
            <div class="stats">
    <div class="stat-box stat-income">
        Income<br />
        ${formatCurrency(income)}
    </div>

    <div class="stat-box stat-expense">
        Expense<br />
        ${formatCurrency(expense)}
    </div>

    <div class="stat-box stat-borrow">
        Borrow<br />
        ${formatCurrency(borrow)}
    </div>
</div>


            <!-- TRANSACTIONS TABLE -->
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date & Time</th>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>

            <!-- FOOTER -->
            <footer>
    <div class="page-number"></div>
    <img
        src="data:image/png;base64,${LOGO_BASE64}"
        class="footer-logo"
    />
</footer>


        </body>
        </html>
        `;

        const { uri } = await Print.printToFileAsync({
            html,
            base64: false
        });

        await Sharing.shareAsync(uri);

    } catch (error) {
        console.log("Closed Month PDF Error:", error);
        throw error;
    }
};