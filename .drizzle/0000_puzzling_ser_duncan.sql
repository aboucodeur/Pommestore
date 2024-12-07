CREATE TABLE IF NOT EXISTS "achats" (
	"a_id" serial PRIMARY KEY NOT NULL,
	"a_date" timestamp with time zone DEFAULT now() NOT NULL,
	"a_etat" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"f_id" integer NOT NULL,
	"en_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "acommandes" (
	"ac_id" serial PRIMARY KEY NOT NULL,
	"ac_etat" integer DEFAULT 0 NOT NULL,
	"ac_qte" numeric(15, 2) DEFAULT '0' NOT NULL,
	"ac_prix" numeric(15, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"i_id" integer NOT NULL,
	"a_id" integer NOT NULL,
	CONSTRAINT "acommandes_unique1" UNIQUE("i_id","a_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"c_id" serial PRIMARY KEY NOT NULL,
	"c_nom" varchar(100) NOT NULL,
	"c_tel" varchar(25),
	"c_adr" varchar(200),
	"c_type" varchar(10) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"en_id" integer NOT NULL,
	CONSTRAINT "clients_unique1" UNIQUE("c_nom","en_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entreprises" (
	"en_id" serial PRIMARY KEY NOT NULL,
	"en_nom" varchar(100) NOT NULL,
	"en_tel" varchar(45) NOT NULL,
	"en_email" varchar(100) NOT NULL,
	"en_desc" varchar(256),
	"en_adr" varchar(256),
	"en_logo" varchar(256),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "entreprises_unique1" UNIQUE("en_nom"),
	CONSTRAINT "entreprises_unique2" UNIQUE("en_tel"),
	CONSTRAINT "entreprises_unique3" UNIQUE("en_email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fournisseurs" (
	"f_id" serial PRIMARY KEY NOT NULL,
	"f_nom" varchar(100) NOT NULL,
	"f_tel" varchar(25),
	"f_adr" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"en_id" integer NOT NULL,
	CONSTRAINT "fournisseurs_unique1" UNIQUE("f_nom","en_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iphones" (
	"i_id" serial PRIMARY KEY NOT NULL,
	"i_barcode" varchar(100) NOT NULL,
	"i_instock" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"m_id" integer NOT NULL,
	CONSTRAINT "iphones_unique1" UNIQUE("i_barcode","m_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modeles" (
	"m_id" serial PRIMARY KEY NOT NULL,
	"m_nom" varchar(60) NOT NULL,
	"m_type" varchar(25) NOT NULL,
	"m_qte" integer DEFAULT 0 NOT NULL,
	"m_prix" numeric(15, 2) DEFAULT '0' NOT NULL,
	"m_memoire" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"en_id" integer NOT NULL,
	CONSTRAINT "modeles_unique1" UNIQUE("m_nom","m_type","m_memoire","en_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"u_prenom" varchar(60) NOT NULL,
	"u_nom" varchar(30) NOT NULL,
	"role" varchar(5) DEFAULT 'admin',
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"name" text NOT NULL,
	"password" varchar(200) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"en_id" integer NOT NULL,
	CONSTRAINT "user_unique1" UNIQUE("email"),
	CONSTRAINT "users_unique1" UNIQUE("u_prenom","u_nom"),
	CONSTRAINT "users_unique2" UNIQUE("name"),
	CONSTRAINT "users_unique3" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vcommandes" (
	"vc_id" serial PRIMARY KEY NOT NULL,
	"vc_etat" integer DEFAULT 0 NOT NULL,
	"vc_qte" numeric(15, 2) DEFAULT '0' NOT NULL,
	"vc_prix" numeric(15, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"i_id" integer NOT NULL,
	"v_id" integer NOT NULL,
	CONSTRAINT "vcommandes_unique1" UNIQUE("i_id","v_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ventes" (
	"v_id" serial PRIMARY KEY NOT NULL,
	"v_date" timestamp with time zone DEFAULT now() NOT NULL,
	"v_etat" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"c_id" integer NOT NULL,
	"en_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vpaiements" (
	"vp_id" serial PRIMARY KEY NOT NULL,
	"vp_date" timestamp with time zone NOT NULL,
	"vp_motif" varchar(200) NOT NULL,
	"vp_montant" integer NOT NULL,
	"vp_etat" smallint DEFAULT 0 NOT NULL,
	"v_id" integer NOT NULL,
	"i_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "achats" ADD CONSTRAINT "achats_fkey1" FOREIGN KEY ("f_id") REFERENCES "public"."fournisseurs"("f_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "achats" ADD CONSTRAINT "achats_fkey2" FOREIGN KEY ("en_id") REFERENCES "public"."entreprises"("en_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "acommandes" ADD CONSTRAINT "acommandes_fkey1" FOREIGN KEY ("i_id") REFERENCES "public"."iphones"("i_id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "acommandes" ADD CONSTRAINT "acommandes_fkey2" FOREIGN KEY ("a_id") REFERENCES "public"."achats"("a_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients" ADD CONSTRAINT "clients_fkey1" FOREIGN KEY ("en_id") REFERENCES "public"."entreprises"("en_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fournisseurs" ADD CONSTRAINT "fournisseurs_fkey1" FOREIGN KEY ("en_id") REFERENCES "public"."entreprises"("en_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iphones" ADD CONSTRAINT "iphones_fkey1" FOREIGN KEY ("m_id") REFERENCES "public"."modeles"("m_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modeles" ADD CONSTRAINT "modeles_fkey1" FOREIGN KEY ("en_id") REFERENCES "public"."entreprises"("en_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_fkey1" FOREIGN KEY ("en_id") REFERENCES "public"."entreprises"("en_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vcommandes" ADD CONSTRAINT "vcommandes_fkey1" FOREIGN KEY ("i_id") REFERENCES "public"."iphones"("i_id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vcommandes" ADD CONSTRAINT "vcommandes_fkey2" FOREIGN KEY ("v_id") REFERENCES "public"."ventes"("v_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ventes" ADD CONSTRAINT "ventes_fkey1" FOREIGN KEY ("c_id") REFERENCES "public"."clients"("c_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ventes" ADD CONSTRAINT "ventes_fkey2" FOREIGN KEY ("en_id") REFERENCES "public"."entreprises"("en_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vpaiements" ADD CONSTRAINT "vpaiements_fkey1" FOREIGN KEY ("v_id") REFERENCES "public"."ventes"("v_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vpaiements" ADD CONSTRAINT "vpaiements_fkey2" FOREIGN KEY ("i_id") REFERENCES "public"."iphones"("i_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
