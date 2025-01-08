export default function mealKey(id: number) {
    switch (id) {
        case 1:
            return "breakfast"
        case 2:
            return "morning"
        case 3:
            return "lunch"
        case 4:
            return "afternoon"
        case 5:
            return "dinner"
        default: throw Error("no such meal")
    }
}