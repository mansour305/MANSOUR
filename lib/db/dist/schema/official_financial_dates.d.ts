import { z } from "zod/v4";
/**
 * Table storing authoritative information about financial events such as
 * salary deposits and social support programmes. These records are
 * maintained by administrators and referenced by user-level `financial_events`.
 */
export declare const officialFinancialDatesTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "official_financial_dates";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "official_financial_dates";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        event_key: import("drizzle-orm/pg-core").PgColumn<{
            name: "event_key";
            tableName: "official_financial_dates";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        event_name_ar: import("drizzle-orm/pg-core").PgColumn<{
            name: "event_name_ar";
            tableName: "official_financial_dates";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        occurrence_date_gregorian: import("drizzle-orm/pg-core").PgColumn<{
            name: "occurrence_date_gregorian";
            tableName: "official_financial_dates";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        occurrence_date_hijri: import("drizzle-orm/pg-core").PgColumn<{
            name: "occurrence_date_hijri";
            tableName: "official_financial_dates";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        source_authority: import("drizzle-orm/pg-core").PgColumn<{
            name: "source_authority";
            tableName: "official_financial_dates";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        source_url: import("drizzle-orm/pg-core").PgColumn<{
            name: "source_url";
            tableName: "official_financial_dates";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        verified_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "verified_at";
            tableName: "official_financial_dates";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        is_confirmed: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_confirmed";
            tableName: "official_financial_dates";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        created_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "official_financial_dates";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertOfficialFinancialDateSchema: z.ZodObject<{
    event_key: z.ZodString;
    event_name_ar: z.ZodString;
    occurrence_date_gregorian: z.ZodString;
    occurrence_date_hijri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    source_authority: z.ZodString;
    source_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    verified_at: z.ZodDate;
    is_confirmed: z.ZodOptional<z.ZodBoolean>;
}, {
    out: {};
    in: {};
}>;
export type InsertOfficialFinancialDate = z.infer<typeof insertOfficialFinancialDateSchema>;
export type OfficialFinancialDate = typeof officialFinancialDatesTable.$inferSelect;
//# sourceMappingURL=official_financial_dates.d.ts.map