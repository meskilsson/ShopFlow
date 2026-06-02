export function formatDateEnglish(value?: string | null) {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString("en-EN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
