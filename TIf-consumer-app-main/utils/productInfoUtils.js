export function getFormattedPrice (currencyID, priceAmt) {
    return priceAmt.toLocaleString("en-IN", {
        style: "currency",
        currency: currencyID,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}