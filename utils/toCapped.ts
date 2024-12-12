// This function returns the number with a max of 'cap' decimal places
export default function toCapped(num: number, cap: number): number {
    const tens = Math.pow(10, cap)
    return Math.round((num + Number.EPSILON) * tens) / tens
}