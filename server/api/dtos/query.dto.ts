import { z } from "zod";

export class QueryDTO {
    private static createBaseSchema(defaultPage: number, defaultSize: number) {
        return z.object({
            page: z.preprocess(
                (x) => (x ? x : undefined),
                z.coerce.number().int().min(1).default(defaultPage),
            ),
            size: z.preprocess(
                (x) => (x ? x : undefined),
                z.coerce.number().int().min(0).default(defaultSize),
            ),
        });
    }

    public static createQueryParam(defaultPage: number) {
        return z.preprocess(
            (x) => (x ? x : undefined),
            z.coerce.number().int().min(1).default(defaultPage),
        );
    }

    public static createPaginationSchema(defaultPage = 1, defaultSize = 10) {
        return this.createBaseSchema(defaultPage, defaultSize);
    }

    public static createFilterSchema(defaultPage = 1, defaultSize = 10) {
        return this.createBaseSchema(defaultPage, defaultSize).extend({
            filterBy: z.string().optional(),
        });
    }

    public static createAdvancedSchema(defaultPage = 1, defaultSize = 10) {
        return this.createFilterSchema(defaultPage, defaultSize).extend({
            dateFrom: z.preprocess((x) => {
                if (typeof x === "string" || x instanceof Date) {
                    const parsedDate = new Date(x);
                    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
                }
                return undefined;
            }, z.date().optional()),
            dateTo: z.preprocess((x) => {
                if (typeof x === "string" || x instanceof Date) {
                    const parsedDate = new Date(x);
                    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
                }
                return undefined;
            }, z.date().optional()),
            isSortByCreatedAt: z.preprocess(
                (x) => (x ? x : undefined),
                z.coerce.boolean(),
            ),
            sortOrder: z.string().optional(),
        });
    }
}
