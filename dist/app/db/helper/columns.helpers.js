"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamps = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.timestamps = {
    updated_at: (0, pg_core_1.timestamp)().defaultNow(),
    created_at: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    deleted_at: (0, pg_core_1.timestamp)(),
};
