export const formatDate = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "long",
    });

    const parts = formatter.formatToParts(date);

    const getPartValue = (type: string): string =>
        parts.find((part) => part.type === type)?.value || "Unknown";

    return `${getPartValue("month")}, ${getPartValue("weekday")} ${getPartValue("day")}`;
};
