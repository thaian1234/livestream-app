import { z } from "zod";

export class QueryDTO {
    private static readonly parseDatePreprocess = (x: unknown) => {
        if (typeof x === "string" || x instanceof Date) {
            const parsedDate = new Date(x);
            return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        }
        return undefined;
    };

    private static readonly defaultPreprocess = (x: unknown) => x || undefined;

    private static createBaseSchema(defaultPage: number, defaultSize: number) {
        return z.object({
            page: z.preprocess(
                this.defaultPreprocess,
                z.coerce.number().int().min(1).default(defaultPage),
            ),
            size: z.preprocess(
                this.defaultPreprocess,
                z.coerce.number().int().min(0).default(defaultSize),
            ),
        });
    }

    public static createQueryParam(defaultPage: number) {
        return z.preprocess(
            this.defaultPreprocess,
            z.coerce.number().int().min(1).default(defaultPage),
        );
    }

    public static createPaginationSchema(defaultPage = 1, defaultSize = 8) {
        return this.createBaseSchema(defaultPage, defaultSize);
    }

    public static createFilterSchema(defaultPage = 1, defaultSize = 8) {
        return this.createBaseSchema(defaultPage, defaultSize).extend({
            filterBy: z.string().default("").nullable(),
        });
    }

    public static createAdvancedSchema(defaultPage = 1, defaultSize = 8) {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

        return this.createFilterSchema(defaultPage, defaultSize).extend({
            dateFrom: z
                .preprocess(
                    this.parseDatePreprocess,
                    z.date().default(thirtyDaysAgo),
                )
                .optional(),
            dateTo: z
                .preprocess(
                    this.parseDatePreprocess,
                    z.date().default(new Date()),
                )
                .optional(),
            isSortByCreatedAt: z
                .preprocess(this.defaultPreprocess, z.coerce.boolean())
                .optional(),
            sortOrder: z.string().default("asc").optional(),
        });
    }
}

export namespace QueryDTO {
    export type Pagination = z.infer<
        ReturnType<typeof QueryDTO.createPaginationSchema>
    >;
    export type Filter = z.infer<
        ReturnType<typeof QueryDTO.createFilterSchema>
    >;
    export type Advanced = z.infer<
        ReturnType<typeof QueryDTO.createAdvancedSchema>
    >;
}
