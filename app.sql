-- IKAIPHONE V2

CREATE TABLE modeles (
    m_id SERIAL PRIMARY KEY,
    m_nom VARCHAR(60) NOT NULL,
    m_type VARCHAR(25) NOT NULL,
    m_qte DECIMAL(15,2) NOT NULL DEFAULT 0,
    m_prix DECIMAL(15,2) NOT NULL DEFAULT 0,
    m_memoire SMALLINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    en_id INT UNSIGNED NOT NULL, -- identiant de l'entreprise

    CONSTRAINT modeles_unique1 UNIQUE (m_nom, m_type, m_memoire, en_id),
    CONSTRAINT modeles_fkey1 FOREIGN KEY (en_id) REFERENCES entreprises (en_id) ON UPDATE CASCADE
);

CREATE TABLE iphones (
    i_id SERIAL PRIMARY KEY,
    i_barcode VARCHAR(100) NOT NULL UNIQUE,
    i_instock BOOLEAN NOT NULL DEFAULT TRUE,
    m_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT iphones_unique1 UNIQUE (i_barcode, m_id), -- l'imei peut se repeter mais de modele differents
    CONSTRAINT iphones_fkey1 FOREIGN KEY (m_id) REFERENCES modeles (m_id) ON UPDATE CASCADE
);

CREATE TABLE fournisseurs (
    f_id SERIAL PRIMARY KEY,
    f_nom VARCHAR(100) NOT NULL,
    f_tel VARCHAR(25) NULL,
    f_adr VARCHAR(200) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    en_id INT UNSIGNED NOT NULL,

    CONSTRAINT fournisseurs_unique1 UNIQUE (f_nom, en_id),
    CONSTRAINT fournisseurs_fkey1 FOREIGN KEY (en_id) REFERENCES entreprises (en_id) ON UPDATE CASCADE
);

CREATE TABLE clients (
    c_id SERIAL PRIMARY KEY,
    c_nom VARCHAR(100) NOT NULL,
    c_tel VARCHAR(25) NULL,
    c_adr VARCHAR(200) NULL,
    c_type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    en_id INT UNSIGNED NOT NULL,

    CONSTRAINT clients_unique1 UNIQUE (c_nom, en_id),
    CONSTRAINT clients_fkey1 FOREIGN KEY (en_id) REFERENCES entreprises (en_id) ON UPDATE CASCADE
);

CREATE TABLE ventes (
    v_id SERIAL PRIMARY KEY,
    v_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v_type CHAR(3) NOT NULL, -- type de vente : classique ou re-vendeur
    v_etat INT NOT NULL, -- 0 : en cours, 1 : valider
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    c_id INT UNSIGNED NOT NULL,
    CONSTRAINT ventes_fkey1 FOREIGN KEY (c_id) REFERENCES clients (c_id) ON UPDATE CASCADE
);

CREATE TABLE achats (
    a_id SERIAL PRIMARY KEY,
    a_date TIMESTAMP NOT NULL,
    a_etat INT NOT NULL, -- 0 : en cours, 1 : valider
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    f_id INT UNSIGNED NOT NULL,
    CONSTRAINT achats_fkey1 FOREIGN KEY (f_id) REFERENCES fournisseurs (f_id) ON UPDATE CASCADE
);

CREATE TABLE vpaiements (
    vp_id SERIAL PRIMARY KEY,
    vp_date TIMESTAMP NOT NULL,
    vp_motif VARCHAR(200) NOT NULL,
    vp_montant INT NOT NULL,
    vp_etat SMALLINT NOT NULL DEFAULT 0,
    v_id INT UNSIGNED NOT NULL,
    i_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT vpaiements_fkey1 FOREIGN KEY (v_id) REFERENCES vendres (v_id) ON UPDATE CASCADE,
    CONSTRAINT vpaiements_fkey2 FOREIGN KEY (i_id) REFERENCES iphones (i_id) ON UPDATE CASCADE
);

CREATE TABLE acommandes (
    ac_id SERIAL PRIMARY KEY,
    ac_etat INT NOT NULL DEFAULT 0,
    ac_qte DECIMAL(15,2) NOT NULL DEFAULT 0,
    ac_prix DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    i_id INT UNSIGNED NOT NULL,
    a_id INT UNSIGNED NOT NULL,

    CONSTRAINT acommandes_check1 check (ac_etat in (0,1,2,3)),
    CONSTRAINT acommandes_unique1 UNIQUE (i_id, a_id),
    CONSTRAINT acommandes_fkey1 FOREIGN KEY (i_id) REFERENCES iphones (i_id) ON UPDATE CASCADE,
    CONSTRAINT acommandes_fkey2 FOREIGN KEY (a_id) REFERENCES achats (a_id) ON UPDATE CASCADE
);

CREATE TABLE vcommandes (
    vc_id SERIAL PRIMARY KEY,
    vc_etat INT NOT NULL DEFAULT 0,
    vc_qte DECIMAL(15,2) NOT NULL DEFAULT 0,
    vc_prix DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    i_id INT UNSIGNED NOT NULL,
    v_id INT UNSIGNED NOT NULL,

    -- etat de la commande : 0 : en cours, 1 : valider, 2 : rendre, 3 : annuler
    CONSTRAINT vcommandes_check1 check (vc_etat in (0,1,2,3)),
    CONSTRAINT vcommandes_unique1 UNIQUE (i_id, v_id),
    CONSTRAINT vcommandes_fkey1 FOREIGN KEY (i_id) REFERENCES iphones (i_id) ON UPDATE CASCADE,
    CONSTRAINT vcommandes_fkey2 FOREIGN KEY (v_id) REFERENCES vendres (v_id) ON UPDATE CASCADE
);

-- Ameliorations des performances de l'application

-- 1. Index pour les recherches par entreprise (utilisé dans presque toutes les requêtes)
CREATE INDEX idx_clients_en_id ON clients(en_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_fournisseurs_en_id ON fournisseurs(en_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_modeles_en_id ON modeles(en_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ventes_en_id ON ventes(en_id);
CREATE INDEX idx_achats_en_id ON achats(en_id);

-- 2. Index pour les recherches de modèles (utilisé dans getModeles)
CREATE INDEX idx_modeles_composite ON modeles(en_id, m_nom, created_at) 
WHERE deleted_at IS NULL;

-- 3. Index pour les recherches d'iPhones (utilisé dans getIphonesInfos)
CREATE INDEX idx_iphones_barcode ON iphones(i_barcode);
CREATE INDEX idx_iphones_instock ON iphones(i_instock) WHERE deleted_at IS NULL;

-- 4. Index pour les commandes (utilisés dans getVenteDetails et getAchatDetails)
CREATE INDEX idx_vcommandes_v_id ON vcommandes(v_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_acommandes_a_id ON acommandes(a_id) WHERE deleted_at IS NULL;

-- 5. Index pour les recherches par nom (utilisé dans les tris)
CREATE INDEX idx_clients_nom ON clients(c_nom) WHERE deleted_at IS NULL;
CREATE INDEX idx_fournisseurs_nom ON fournisseurs(f_nom) WHERE deleted_at IS NULL;

-- 6. Index pour les états des commandes
CREATE INDEX idx_ventes_etat ON ventes(v_etat);
CREATE INDEX idx_achats_etat ON achats(a_etat);
CREATE INDEX idx_vcommandes_etat ON vcommandes(vc_etat) WHERE deleted_at IS NULL;
CREATE INDEX idx_acommandes_etat ON acommandes(ac_etat) WHERE deleted_at IS NULL;

-- 7. Index pour les paiements
CREATE INDEX idx_vpaiements_v_id ON vpaiements(v_id, vp_etat) 
WHERE deleted_at IS NULL;

-- 8. Index pour les dates (utile pour les rapports)
CREATE INDEX idx_ventes_date ON ventes(v_date);
CREATE INDEX idx_achats_date ON achats(a_date);

-- Triggers de l'application !

-- Création de la fonction qui sera appelée par le trigger
CREATE OR REPLACE FUNCTION delete_iphone_related()
RETURNS TRIGGER AS $$
BEGIN
    -- Suppression des commandes d'achats liées à l'iPhone
    DELETE FROM acommandes
    WHERE i_id = OLD.i_id;
    
    -- Suppression des commandes de ventes liées à l'iPhone
    DELETE FROM vcommandes
    WHERE i_id = OLD.i_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Création du trigger qui s'exécute AVANT la suppression d'un iPhone
CREATE OR REPLACE TRIGGER trigger_delete_iphone
    BEFORE DELETE ON iphones
    FOR EACH ROW
    EXECUTE FUNCTION delete_iphone_related();