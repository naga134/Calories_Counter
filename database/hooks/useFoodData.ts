import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNutritablesByFood } from 'database/queries/nutritablesQueries';
import { getFoodById } from 'database/queries/foodsQueries';
import { addDatabaseChangeListener, SQLiteDatabase } from 'expo-sqlite';
import { useUnits } from './useUnits';
import { Food, Nutritable, Unit } from 'database/types';

type UseFoodDataProps = {
    foodId: number;
    database: SQLiteDatabase;
};

type FoodData = {
    foodData: {
        food: Food | null,
        loading: boolean,
        fetched: boolean
    },
    nutritablesData: {
        nutritables: Nutritable[],
        loading: boolean,
        fetched: boolean
    },
    units: {
        all: Unit[],
        used: Unit[],
        unused: Unit[]
    }
}

export const useFoodData = ({ foodId, database }: UseFoodDataProps): FoodData => {
    // fetches the food
    const {
        data: food,
        isLoading: foodLoading,
        isFetched: foodFetched,
        refetch: refetchFood,
    } = useQuery({
        queryKey: [`FoodNo.${foodId}`],
        queryFn: () => getFoodById(database, { foodId }),
        initialData: null,
    });

    // fetches the relevant nutritables
    const {
        data: nutritables = [],
        isLoading: nutritablesLoading,
        isFetched: nutritablesFetched,
        refetch: refetchNutritables,
    } = useQuery({
        queryKey: [`FoodNo.${foodId}Nutritables`],
        queryFn: () => getNutritablesByFood(database, { foodId }),
        initialData: [],
    });

    // fetches all units
    const { units: allUnits, unitsFetched } = useUnits(database);

    const { usedUnits, unusedUnits } = useMemo(() => {
        if (!nutritablesFetched || !unitsFetched) {
            return { usedUnits: [], unusedUnits: [] };
        }
        // creates lookup table
        const usedUnitSymbols = new Set(nutritables.map((nutritable) => nutritable.unit.symbol));
        // determine used and unused units
        const usedUnits = allUnits.filter((unit) => usedUnitSymbols.has(unit.symbol));
        const unusedUnits = allUnits.filter((unit) => !usedUnitSymbols.has(unit.symbol));
        return { usedUnits, unusedUnits };
    }, [nutritables, allUnits, nutritablesFetched, unitsFetched]);

    // updates the food and the nutritable on database change
    useEffect(() => {
        const listener = addDatabaseChangeListener((change) => {
            if (change.tableName === 'nutritables') refetchNutritables();
            if (change.tableName === 'foods') refetchFood();
        });
        return () => listener.remove();
    }, [refetchNutritables, refetchFood]);

    return {
        foodData: {
            food: food,
            loading: foodLoading,
            fetched: foodFetched
        },
        nutritablesData: {
            nutritables: nutritables,
            loading: nutritablesLoading,
            fetched: nutritablesFetched
        },
        units: {
            all: allUnits,
            used: usedUnits,
            unused: unusedUnits
        }
    };
}
