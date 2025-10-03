export const parseDateRange = (dateStr?: string) => {
  if (!dateStr) return null;

  if (/^\d{4}$/.test(dateStr)) {
    return {
      start: new Date(`${dateStr}-01-01T00:00:00.000Z`),
      end: new Date(`${dateStr}-12-31T23:59:59.999Z`),
    };
  } else if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const end = new Date(
      new Date(`${year}-${month}-01T23:59:59.999Z`).setMonth(
        parseInt(month) - 1 + 1
      )
    );
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return {
      start: new Date(`${dateStr}T00:00:00.000Z`),
      end: new Date(`${dateStr}T23:59:59.999Z`),
    };
  }
  return null;
};
