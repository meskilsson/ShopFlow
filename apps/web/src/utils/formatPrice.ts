export function formatPrice(price: number) {
    return new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
    }).format(price);
}