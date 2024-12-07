import { relations } from "drizzle-orm";
import {
  decimal,
  foreignKey,
  integer,
  pgTableCreator,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `${name}s`); // multi project for one db

/**
 * * ************************
 * * App with organisation  *
 * * ************************
 */

export const entreprises = createTable("entreprise", {
  en_id: serial("en_id").primaryKey(),
  en_nom: varchar("en_nom", { length: 100 })
    .notNull()
    .unique("entreprises_unique1"),
  en_tel: varchar("en_tel", { length: 45 })
    .notNull()
    .unique("entreprises_unique2"),
  en_email: varchar("en_email", { length: 100 })
    .notNull()
    .unique("entreprises_unique3"),
  en_desc: varchar("en_desc", { length: 256 }),
  en_adr: varchar("en_adr", { length: 256 }),
  en_logo: varchar("en_logo", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const users = createTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()), // UUID vs Serial
    u_prenom: varchar("u_prenom", { length: 60 }).notNull(),
    u_nom: varchar("u_nom", { length: 30 }).notNull(),
    role: varchar("role", { length: 5 })
      .$type<"root" | "admin" | "user">()
      .default("admin"), // root (superuser)
    email: text("email").unique("user_unique1"),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    name: text("name").notNull(),
    password: varchar("password", { length: 200 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    en_id: integer("en_id").notNull(), // organisation_app
  },
  (table) => ({
    uq1: unique("users_unique1").on(table.u_prenom, table.u_nom),
    uq2: unique("users_unique2").on(table.name),
    uq3: unique("users_unique3").on(table.email),
    fk1: foreignKey({
      name: "users_fkey1",
      columns: [table.en_id],
      foreignColumns: [entreprises.en_id],
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  }),
);

export const sessions = createTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// types
export type Users = typeof users.$inferSelect;

export const modeles = createTable(
  "modele",
  {
    m_id: serial("m_id").primaryKey(),
    m_nom: varchar("m_nom", { length: 60 }).notNull(),
    m_type: varchar("m_type", { length: 25 }).notNull(),
    m_qte: integer("m_qte").notNull().default(0),
    m_prix: decimal("m_prix", { precision: 15, scale: 2 })
      .notNull()
      .default("0"),
    m_memoire: smallint("m_memoire").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    en_id: integer("en_id").notNull(),
  },
  (table) => ({
    uniq1: unique("modeles_unique1").on(
      table.m_nom,
      table.m_type,
      table.m_memoire,
      table.en_id,
    ),
    fk1: foreignKey({
      name: "modeles_fkey1",
      columns: [table.en_id],
      foreignColumns: [entreprises.en_id],
    }).onUpdate("cascade"),
  }),
);

export const iphones = createTable(
  "iphone",
  {
    i_id: serial("i_id").primaryKey(),
    i_barcode: varchar("i_barcode", { length: 100 }).notNull(),
    i_instock: smallint("i_instock").notNull().$type<0 | 1>().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    m_id: integer("m_id").notNull(),
  },
  (table) => ({
    uniq1: unique("iphones_unique1").on(table.i_barcode, table.m_id),
    fk1: foreignKey({
      name: "iphones_fkey1",
      columns: [table.m_id],
      foreignColumns: [modeles.m_id],
    }).onUpdate("cascade"),
  }),
);

export const fournisseurs = createTable(
  "fournisseur",
  {
    f_id: serial("f_id").primaryKey(),
    f_nom: varchar("f_nom", { length: 100 }).notNull(),
    f_tel: varchar("f_tel", { length: 25 }),
    f_adr: varchar("f_adr", { length: 200 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    en_id: integer("en_id").notNull(),
  },
  (table) => ({
    uniq1: unique("fournisseurs_unique1").on(table.f_nom, table.en_id),
    fk1: foreignKey({
      name: "fournisseurs_fkey1",
      columns: [table.en_id],
      foreignColumns: [entreprises.en_id],
    }).onUpdate("cascade"),
  }),
);

export const clients = createTable(
  "client",
  {
    c_id: serial("c_id").primaryKey(),
    c_nom: varchar("c_nom", { length: 100 }).notNull(),
    c_tel: varchar("c_tel", { length: 25 }),
    c_adr: varchar("c_adr", { length: 200 }),
    c_type: varchar("c_type", { length: 10 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    en_id: integer("en_id").notNull(),
  },
  (table) => ({
    uniq1: unique("clients_unique1").on(table.c_nom, table.en_id),
    fk1: foreignKey({
      name: "clients_fkey1",
      columns: [table.en_id],
      foreignColumns: [entreprises.en_id],
    }).onUpdate("cascade"),
  }),
);

export const ventes = createTable(
  "vente",
  {
    v_id: serial("v_id").primaryKey(),
    v_date: timestamp("v_date", { withTimezone: true }).defaultNow().notNull(),
    v_etat: integer("v_etat").notNull().default(0).$type<0 | 1 | 2>(), // (en cours, valider, annuler)Il
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    c_id: integer("c_id").notNull(),
    en_id: integer("en_id").notNull(),
  },
  (table) => ({
    fk1: foreignKey({
      name: "ventes_fkey1",
      columns: [table.c_id],
      foreignColumns: [clients.c_id],
    }).onUpdate("cascade"),
    fk2: foreignKey({
      name: "ventes_fkey2",
      columns: [table.en_id],
      foreignColumns: [entreprises.en_id],
    }).onUpdate("cascade"),
  }),
);

export const achats = createTable(
  "achat",
  {
    a_id: serial("a_id").primaryKey(),
    a_date: timestamp("a_date", { withTimezone: true }).defaultNow().notNull(),
    a_etat: smallint("a_etat").notNull().default(0).$type<0 | 1 | 2>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    f_id: integer("f_id").notNull(),
    en_id: integer("en_id").notNull(),
  },
  (table) => ({
    fk1: foreignKey({
      name: "achats_fkey1",
      columns: [table.f_id],
      foreignColumns: [fournisseurs.f_id],
    }).onUpdate("cascade"),
    fk2: foreignKey({
      name: "achats_fkey2",
      columns: [table.en_id],
      foreignColumns: [entreprises.en_id],
    }).onUpdate("cascade"),
  }),
);

export const vpaiements = createTable(
  "vpaiement",
  {
    vp_id: serial("vp_id").primaryKey(),
    vp_date: timestamp("vp_date", { withTimezone: true }).notNull(),
    vp_motif: varchar("vp_motif", { length: 200 }).notNull(),
    vp_montant: integer("vp_montant").notNull(),
    vp_etat: smallint("vp_etat").notNull().default(0),
    v_id: integer("v_id").notNull(),
    i_id: integer("i_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    fk1: foreignKey({
      name: "vpaiements_fkey1",
      columns: [table.v_id],
      foreignColumns: [ventes.v_id],
    }).onUpdate("cascade"),
    fk2: foreignKey({
      name: "vpaiements_fkey2",
      columns: [table.i_id],
      foreignColumns: [iphones.i_id],
    }).onUpdate("cascade"),
  }),
);

export const acommandes = createTable(
  "acommande",
  {
    ac_id: serial("ac_id").primaryKey(),
    ac_etat: integer("ac_etat").notNull().default(0),
    ac_qte: decimal("ac_qte", { precision: 15, scale: 2 })
      .notNull()
      .default("0"),
    ac_prix: decimal("ac_prix", { precision: 15, scale: 2 })
      .notNull()
      .default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    i_id: integer("i_id").notNull(),
    a_id: integer("a_id").notNull(),
  },
  (table) => ({
    uniq1: unique("acommandes_unique1").on(table.i_id, table.a_id),
    // check1: check("acommandes_check1").on(table.ac_etat).in([0, 1, 2, 3]),
    fk1: foreignKey({
      name: "acommandes_fkey1",
      columns: [table.i_id],
      foreignColumns: [iphones.i_id],
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    fk2: foreignKey({
      name: "acommandes_fkey2",
      columns: [table.a_id],
      foreignColumns: [achats.a_id],
    }).onUpdate("cascade"),
  }),
);

export const vcommandes = createTable(
  "vcommande",
  {
    vc_id: serial("vc_id").primaryKey(),
    vc_etat: integer("vc_etat").notNull().default(0),
    vc_qte: decimal("vc_qte", { precision: 15, scale: 2 })
      .notNull()
      .default("0"),
    vc_prix: decimal("vc_prix", { precision: 15, scale: 2 })
      .notNull()
      .default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    i_id: integer("i_id").notNull(),
    v_id: integer("v_id").notNull(),
  },
  (table) => ({
    uniq1: unique("vcommandes_unique1").on(table.i_id, table.v_id),
    // check1: check("vcommandes_check1").on(table.vc_etat).in([0, 1, 2, 3]),
    fk1: foreignKey({
      name: "vcommandes_fkey1",
      columns: [table.i_id],
      foreignColumns: [iphones.i_id],
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    fk2: foreignKey({
      name: "vcommandes_fkey2",
      columns: [table.v_id],
      foreignColumns: [ventes.v_id],
    }).onUpdate("cascade"),
  }),
);

/**
 * * ************************
 * * Relations des tables ! *
 * * ************************
 */

export const entreprisesTableRelations = relations(entreprises, ({ many }) => ({
  // ... une entreprise a plusieurs users
  users: many(users),
}));

export const usersTableRelations = relations(users, ({ one }) => ({
  // .. un user appartient a une entreprise
  entreprise: one(entreprises, {
    fields: [users.en_id],
    references: [entreprises.en_id],
  }),
}));

export const modelesRelations = relations(modeles, ({ one, many }) => ({
  entreprise: one(entreprises, {
    fields: [modeles.en_id],
    references: [entreprises.en_id],
  }),
  iphones: many(iphones),
}));

export const iphonesRelations = relations(iphones, ({ one, many }) => ({
  modele: one(modeles, {
    fields: [iphones.m_id],
    references: [modeles.m_id],
  }),
  vpaiements: many(vpaiements),
  acommandes: many(acommandes),
  vcommandes: many(vcommandes),
}));

export const fournisseursRelations = relations(
  fournisseurs,
  ({ one, many }) => ({
    entreprise: one(entreprises, {
      fields: [fournisseurs.en_id],
      references: [entreprises.en_id],
    }),
    achats: many(achats),
  }),
);

export const clientsRelations = relations(clients, ({ one, many }) => ({
  entreprise: one(entreprises, {
    fields: [clients.en_id],
    references: [entreprises.en_id],
  }),
  ventes: many(ventes),
}));

export const ventesRelations = relations(ventes, ({ one, many }) => ({
  client: one(clients, {
    fields: [ventes.c_id],
    references: [clients.c_id],
  }),
  vpaiements: many(vpaiements),
  vcommandes: many(vcommandes),
}));

export const achatsRelations = relations(achats, ({ one, many }) => ({
  fournisseur: one(fournisseurs, {
    fields: [achats.f_id],
    references: [fournisseurs.f_id],
  }),
  acommandes: many(acommandes),
}));

export const vpaiementsRelations = relations(vpaiements, ({ one }) => ({
  vente: one(ventes, {
    fields: [vpaiements.v_id],
    references: [ventes.v_id],
  }),
  iphone: one(iphones, {
    fields: [vpaiements.i_id],
    references: [iphones.i_id],
  }),
}));

export const acommandesRelations = relations(acommandes, ({ one }) => ({
  iphone: one(iphones, {
    fields: [acommandes.i_id],
    references: [iphones.i_id],
  }),
  achat: one(achats, {
    fields: [acommandes.a_id],
    references: [achats.a_id],
  }),
}));

export const vcommandesRelations = relations(vcommandes, ({ one }) => ({
  iphone: one(iphones, {
    fields: [vcommandes.i_id],
    references: [iphones.i_id],
  }),
  vente: one(ventes, {
    fields: [vcommandes.v_id],
    references: [ventes.v_id],
  }),
}));

// many to many
// export const projectAssignments = createTable("projectAssignment", {
//   userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
//   projectId: text("projectId").references(() => projects.id, { onDelete: "cascade" }),
// });
