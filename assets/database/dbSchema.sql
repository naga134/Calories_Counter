-- MEALS
CREATE TABLE IF NOT EXISTS "meals" (
    "id" INTEGER UNIQUE PRIMARY KEY NOT NULL,
    "name" TEXT UNIQUE NOT NULL,
);
-- FOODS
CREATE TABLE IF NOT EXISTS "foods" (
    "id" INTEGER UNIQUE PRIMARY KEY NOT NULL,
    "name" TEXT UNIQUE NOT NULL,
    "isDeleted" INTEGER NOT NULL CHECK (isDeleted IN (0, 1))
);
-- MEASUREMENT UNITS
CREATE TABLE IF NOT EXISTS "units" (
    "id" INTEGER UNIQUE PRIMARY KEY NOT NULL,
    "symbol" TEXT UNIQUE NOT NULL
);
-- NUTRITIONAL TABLES
CREATE TABLE IF NOT EXISTS "nutritables" (
    "id" INTEGER UNIQUE PRIMARY KEY NOT NULL,
    "foodId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    -- All numerical values are not-nullable in order to enforce their correct input and/or treatment.
    "baseMeasure" REAL NOT NULL,
    "kcals" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "fats" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "isDeleted" INTEGER NOT NULL CHECK (isDeleted IN (0, 1)),
    -- A (food's) nutritional table belongs to a food. One food can have many nutritional tables.
    FOREIGN KEY ("foodId") REFERENCES "foods" ("id") ON DELETE CASCADE,
    -- A (food's) nutritional table "belongs" to a unit. One unit can have many nutritional tables.
    FOREIGN KEY ("unitId") REFERENCES "units" ("id"),
    -- A food can have only one nutritional table per measurement unit.
    UNIQUE (foodId, unitId)
);
-- ENTRIES
CREATE TABLE IF NOT EXISTS "entries" (
    "id" INTEGER UNIQUE PRIMARY KEY NOT NULL,
    "foodId" INTEGER NOT NULL,
    "nutritableId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,
    -- An entry belongs to a meal. One meal can have many entries.
    FOREIGN KEY ("mealId") REFERENCES "meals" ("id"),
    -- An entry belongs to a food. One food can have many entries.
    FOREIGN KEY ("foodId") REFERENCES "foods" ("id"),
    -- An entry belongs to a nutritional table. One nutritional table can have many entries.
    FOREIGN KEY ("nutritableId") REFERENCES "nutritables" ("id")
);
-- Inserts measurement units.
INSERT INTO units (symbol, id)
VALUES ('g', 1),
    ('ml', 2),
    ('lb', 3),
    ('tsp', 4),
    ('tbsp', 5),
    ('cup', 6),
    ('oz', 7),
    ('unit', 8);
-- Inserts initial ("out-of-the-box") meals.
INSERT INTO meals (id, name)
VALUES (1, 'Breakfast'),
    (2, 'Morning'),
    (3, 'Lunch'),
    (4, 'Afternoon'),
    (5, 'Dinner');
-- Inserts initial foods (for ease of development only - DELETE FOR PRODUCTION)
INSERT INTO foods (id, name, isDeleted)
VALUES (1, 'Milk', 0),
    (2, 'Egg', 0),
    (3, 'Banana', 0);
-- Inserts initial nutritional tables (for ease of development only - DELETE FOR PRODUCTION)
INSERT INTO nutritables (
        foodId,
        unitId,
        baseMeasure,
        kcals,
        carbs,
        fats,
        protein,
        isDeleted
    )
VALUES -- Milk
    (1, 2, 100, 60, 4.7, 3.2, 4.2, 0),
    -- Egg
    (2, 1, 100, 147, 0.77, 9.94, 12.58, 0),
    -- Banana
    (3, 1, 100, 89, 22.84, 0.33, 1.09, 0);
-- TODO: CHECKS(isDeleted)!