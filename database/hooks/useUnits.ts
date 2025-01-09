import { useQuery } from '@tanstack/react-query';
import { SQLiteDatabase } from 'expo-sqlite';
import { getAllUnits } from 'database/queries/unitsQueries';

export function useUnits(database: SQLiteDatabase) {
    const {
        data: units,
        isFetched: unitsFetched,
        isLoading: unitsLoading,
    } = useQuery({
        queryKey: [`allUnits`],
        queryFn: () => getAllUnits(database),
        initialData: [],
    });

    return { units, unitsFetched, unitsLoading };
}
