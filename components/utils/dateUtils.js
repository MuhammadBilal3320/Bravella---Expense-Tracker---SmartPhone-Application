// utils/dateUtils.js

const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

const formatDateWithDay = (date) =>
    date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export const groupTransactionsByDate = (transactions, skipDateGrouping = false) => {
    if (skipDateGrouping) {
        // Just return all transactions as a single section
        return [{ title: "All Transactions", data: transactions }];
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayTx = [];
    const yesterdayTx = [];
    const olderMap = {};

    transactions.forEach(tx => {
        const txDate = new Date(tx.date);

        if (isSameDay(txDate, today)) {
            todayTx.push(tx);
        } else if (isSameDay(txDate, yesterday)) {
            yesterdayTx.push(tx);
        } else {
            const key = formatDateWithDay(txDate);
            if (!olderMap[key]) olderMap[key] = [];
            olderMap[key].push(tx);
        }
    });

    const sections = [];

    if (todayTx.length) sections.push({ title: "Today", data: todayTx });
    if (yesterdayTx.length) sections.push({ title: "Yesterday", data: yesterdayTx });

    Object.keys(olderMap)
        .sort((a, b) => new Date(b) - new Date(a))
        .forEach(date => {
            sections.push({ title: date, data: olderMap[date] });
        });

    return sections;
};

