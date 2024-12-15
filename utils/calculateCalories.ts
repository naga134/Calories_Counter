export default function calculateCalories(protein: number, carbs: number, fat: number): number {
    const safeProtein = isNaN(protein) || protein == null ? 0 : protein;
    const safeCarbs = isNaN(carbs) || carbs == null ? 0 : carbs;
    const safeFat = isNaN(fat) || fat == null ? 0 : fat;

    return (safeProtein ?? 0) * 4 + (safeCarbs ?? 0) * 4 + (safeFat ?? 0) * 9;
}