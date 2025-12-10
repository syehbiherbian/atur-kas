import { pgTable, text, timestamp, uuid, varchar, decimal, boolean, pgEnum, integer, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['OWNER', 'ADMIN', 'MEMBER'])
export const memberStatusEnum = pgEnum('member_status', ['ACTIVE', 'SUSPENDED', 'LEFT'])
export const transactionTypeEnum = pgEnum('transaction_type', ['INCOME', 'EXPENSE'])
export const billStatusEnum = pgEnum('bill_status', ['UNPAID', 'PARTIAL', 'PAID'])
export const billFrequencyEnum = pgEnum('bill_frequency', ['ONCE', 'MONTHLY', 'CUSTOM'])
export const waMessageTypeEnum = pgEnum('wa_message_type', ['REMINDER_BEFORE_DUE', 'ON_DUE_DATE', 'AFTER_DUE', 'CUSTOM_BROADCAST'])
export const waLogStatusEnum = pgEnum('wa_log_status', ['PENDING', 'SENT', 'FAILED'])

// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique(),
    phone: varchar('phone', { length: 20 }).unique(),
    passwordHash: text('password_hash').notNull(),
    avatarUrl: text('avatar_url'),
    language: varchar('language', { length: 5 }).default('id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Kas groups table
export const kasGroups = pgTable('kas_groups', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    currency: varchar('currency', { length: 10 }).default('IDR').notNull(),
    timezone: varchar('timezone', { length: 50 }).default('Asia/Jakarta').notNull(),
    initialBalance: decimal('initial_balance', { precision: 15, scale: 2 }).default('0').notNull(),
    kasType: varchar('kas_type', { length: 50 }), // arisan, kos, komunitas, etc
    ownerId: uuid('owner_id').references(() => users.id).notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Kas members table
export const kasMembers = pgTable('kas_members', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    role: userRoleEnum('role').default('MEMBER').notNull(),
    status: memberStatusEnum('status').default('ACTIVE').notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
    leftAt: timestamp('left_at'),
})

// Invitations table
export const invitations = pgTable('invitations', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull(),
    inviteToken: varchar('invite_token', { length: 100 }).unique().notNull(),
    expiresAt: timestamp('expires_at'),
    maxUses: integer('max_uses'),
    usedCount: integer('used_count').default(0).notNull(),
    createdBy: uuid('created_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Transaction categories table
export const transactionCategories = pgTable('transaction_categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    type: transactionTypeEnum('type').notNull(),
    color: varchar('color', { length: 7 }).default('#3b82f6').notNull(),
    icon: varchar('icon', { length: 50 }),
    createdBy: uuid('created_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Transactions table
export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull(),
    type: transactionTypeEnum('type').notNull(),
    categoryId: uuid('category_id').references(() => transactionCategories.id),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
    date: timestamp('date').notNull(),
    attachmentUrl: text('attachment_url'),
    createdBy: uuid('created_by').references(() => users.id).notNull(),
    billItemId: uuid('bill_item_id'), // Reference to bill payment if applicable
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Bills (iuran/tagihan master) table
export const bills = pgTable('bills', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    amountDefault: decimal('amount_default', { precision: 15, scale: 2 }).notNull(),
    dueDate: timestamp('due_date').notNull(),
    frequency: billFrequencyEnum('frequency').default('ONCE').notNull(),
    createdBy: uuid('created_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Bill items (tagihan per member) table
export const billItems = pgTable('bill_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    billId: uuid('bill_id').references(() => bills.id, { onDelete: 'cascade' }).notNull(),
    memberId: uuid('member_id').references(() => kasMembers.id, { onDelete: 'cascade' }).notNull(),
    amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
    status: billStatusEnum('status').default('UNPAID').notNull(),
    paidAmount: decimal('paid_amount', { precision: 15, scale: 2 }).default('0').notNull(),
    paidAt: timestamp('paid_at'),
    note: text('note'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// WhatsApp settings table
export const waSettings = pgTable('wa_settings', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull().unique(),
    provider: varchar('provider', { length: 50 }).default('fonnte').notNull(),
    apiKey: text('api_key'),
    senderNumber: varchar('sender_number', { length: 20 }),
    isActive: boolean('is_active').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Message templates table
export const messageTemplates = pgTable('message_templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull(),
    type: waMessageTypeEnum('type').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    content: text('content').notNull(),
    createdBy: uuid('created_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// WhatsApp logs table
export const waLogs = pgTable('wa_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }).notNull(),
    memberId: uuid('member_id').references(() => kasMembers.id),
    billItemId: uuid('bill_item_id').references(() => billItems.id),
    phone: varchar('phone', { length: 20 }).notNull(),
    message: text('message').notNull(),
    status: waLogStatusEnum('status').default('PENDING').notNull(),
    providerResponse: jsonb('provider_response'),
    sentAt: timestamp('sent_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Activity logs table
export const activityLogs = pgTable('activity_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    kasId: uuid('kas_id').references(() => kasGroups.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id).notNull(),
    action: varchar('action', { length: 100 }).notNull(),
    entityType: varchar('entity_type', { length: 50 }), // transaction, bill, member, etc
    entityId: uuid('entity_id'),
    metadata: jsonb('metadata'),
    ipAddress: varchar('ip_address', { length: 45 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    ownedKasGroups: many(kasGroups),
    memberships: many(kasMembers),
}))

export const kasGroupsRelations = relations(kasGroups, ({ one, many }) => ({
    owner: one(users, {
        fields: [kasGroups.ownerId],
        references: [users.id],
    }),
    members: many(kasMembers),
    transactions: many(transactions),
    categories: many(transactionCategories),
    bills: many(bills),
    invitations: many(invitations),
    waSettings: one(waSettings),
    messageTemplates: many(messageTemplates),
}))

export const kasMembersRelations = relations(kasMembers, ({ one, many }) => ({
    kas: one(kasGroups, {
        fields: [kasMembers.kasId],
        references: [kasGroups.id],
    }),
    user: one(users, {
        fields: [kasMembers.userId],
        references: [users.id],
    }),
    billItems: many(billItems),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
    kas: one(kasGroups, {
        fields: [transactions.kasId],
        references: [kasGroups.id],
    }),
    category: one(transactionCategories, {
        fields: [transactions.categoryId],
        references: [transactionCategories.id],
    }),
    createdByUser: one(users, {
        fields: [transactions.createdBy],
        references: [users.id],
    }),
}))

export const billsRelations = relations(bills, ({ one, many }) => ({
    kas: one(kasGroups, {
        fields: [bills.kasId],
        references: [kasGroups.id],
    }),
    items: many(billItems),
    createdByUser: one(users, {
        fields: [bills.createdBy],
        references: [users.id],
    }),
}))

export const billItemsRelations = relations(billItems, ({ one }) => ({
    bill: one(bills, {
        fields: [billItems.billId],
        references: [bills.id],
    }),
    member: one(kasMembers, {
        fields: [billItems.memberId],
        references: [kasMembers.id],
    }),
}))

export const invitationsRelations = relations(invitations, ({ one }) => ({
    kas: one(kasGroups, {
        fields: [invitations.kasId],
        references: [kasGroups.id],
    }),
    createdByUser: one(users, {
        fields: [invitations.createdBy],
        references: [users.id],
    }),
}))

export const transactionCategoriesRelations = relations(transactionCategories, ({ one }) => ({
    kas: one(kasGroups, {
        fields: [transactionCategories.kasId],
        references: [kasGroups.id],
    }),
}))

