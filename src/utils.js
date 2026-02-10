import { startOfToday, subDays, format } from 'date-fns';

export const calculateAdherence = (activities) => {
    let totalExpected = 0;
    let totalCompleted = 0;
    const today = startOfToday();

    // Check last 7 days including today
    for (let i = 0; i < 7; i++) {
        const date = subDays(today, i);
        const dayOfWeek = date.getDay(); // 0-6 Sun-Sat
        const dateStr = format(date, 'yyyy-MM-dd');

        activities.forEach(act => {
            if (act.days.includes(dayOfWeek)) {
                totalExpected++;
                if (act.history && act.history[dateStr]) {
                    totalCompleted++;
                }
            }
        });
    }

    return totalExpected === 0 ? 100 : Math.round((totalCompleted / totalExpected) * 100);
};
