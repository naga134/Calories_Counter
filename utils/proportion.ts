
export default function proportion(nutritableMacro: number, entryMeasurement: number, nutritableMeasurement: number) {
    const result = (nutritableMacro * entryMeasurement) / nutritableMeasurement;
    return isNaN(result) ? 0 : Number(result.toFixed(2));
}
