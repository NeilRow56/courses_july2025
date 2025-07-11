import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from './schemaHelpers'
import { relations } from 'drizzle-orm'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  )
})

export const courseLevels = ['beginner', 'intermediate', 'advanced'] as const
export type CourseLevel = (typeof courseLevels)[number]
export const courseLevelEnum = pgEnum('course_level', courseLevels)

export const courseStatuses = ['draft', 'published', 'archived'] as const
export type CourseStatus = (typeof courseStatuses)[number]
export const courseStatusEnum = pgEnum('course__status', courseStatuses)

export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  fileKey: text().notNull(),
  price: integer().notNull(),
  duration: integer().notNull(),
  level: courseLevelEnum().notNull().default('beginner'),
  category: text().notNull(),
  smallDescription: text().notNull(),
  slug: text().notNull().unique(),
  status: courseStatusEnum().notNull().default('draft'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  createdAt,
  updatedAt
})

// Create relations
export const UserRelationships = relations(user, ({ many }) => ({
  CourseTable: many(courses)
}))

export const courseRelations = relations(courses, ({ one }) => ({
  user: one(user, {
    fields: [courses.userId],
    references: [user.id]
  })
}))

export const schema = { user, session, account, verification, courses }
