# ABOU3 STACK

Creer le prochain billion app facilement !
App is => ui (hard and soft) + data (api, database) + mutation (validation)

MOTIVATION : 🛹 => 🛴 => 🏎️ ! (Code less ship more)
Date debut : 03/12/2024 => Re-ecriture de l'application ! vers 18 Heures ~ 22 Heures
V1 : 07/12/2024 a 3H15 => 06/12/2024 (update and fix)

Je dois ship rapidement cet application !
parceque je sens de l'argent la dans

- Pomme store => 80.000 F
- Future phone => 190.000 F
<!-- - Ben services =>  -->
- Et aussi sa serait simple de scaler l'application !

## TODO

✅ Launch mvp fast and without no problem ! (save time) </br>
✅ Play your lofi song and put your airpods ! (1m ~ 3max) </br>
❌ Not multi-tasking </br>
❌ No using google just leverage IA 🤖 [IA FIRST](ia.txt) </br>
TACHES </br>

- [*] 💪 Setup env variables for project (1m) : ✅ | ❌ </br>
- [*] 💪 Setup siteconfig and meta-data (30s ~ 1m) : ✅ | ❌ </br>
- [*] 💪 Create database (remote or local) (5m ~ 1m) : ✅ | ❌ </br>
  </br>
- [*] 💪 Database schema & constraintes (more times like 1h)(<https://www.chatgpt.com>) : ✅ | ❌ </br>
  [EDIT_SCHEMA_DEFAULT](src/server/db/schema.ts) : ✅ | ❌ </br>
  </br>
- [*] 💪 Menu links (5mins) [MENU_CP](src/app/_menus/applink.tsx) : ✅ | ❌ </br>
  [EDIT_MENU](src/app/_menus/menus.tsx) : ✅ | ❌ </br>

- [*] 💪 Auth-routes (backoffice + user and public) [ROUTES](src/app/_routes/auth-route.ts) : ✅ | ❌ </br>

- [ ] 💪 Businees logic (3h ~ max)
      Commencer par les fonctionnalites
      les plus basiques de l'applications !

  - [*] Gestion des clients
  - [*] Gestion des fournisseurs

    Parties essentielles de l'application !

  - [*] Gestion des modeles
  - [*] Gestion des stocks
    Fais le crud maintenant du schema modeles qui lui quelque ameliorations

    - Un champ textearea pour la description lors de l'ajout du modele : qui vas contenir la liste
      des code_bare des iphones separer par virgule filtre pour eviter les
      doublons lors de l'ajout apres modifier la quantite modeles,
      si pas d'imei ajouter seulement le modele avec comme quantite 0
      Fais ses operations dans une transaction pour l'integrite des donnees
      voici comment le faire avec drizzle_orm
      await db.transaction(async (tx) => {
      await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
      await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
      });

    - Et une page /modele/[id] => qui vas afficher les details du modele
      don ses iphones cela veut dire une methode dans queries.ts
      Apres tu vas donner les autres etapes du crud qui sont basique et ressemble
      aux autres schema

    Reflechir sur la logique de suppresions

    - Modeles => les iphones en depends du modele
      Donc reflechir sur la logique de suppresions
      si supprimer definitivement ou avoir un systeme de trash

  - [*] Gestion des ventes (entrees)
    Logique de gestion des commandes de ventes

        Un jeu d'enfant tres facile a implementer

        - Ne pas ajouter un iphone non disponible en stock donc verifier
          lors de l'ajout

        - action : Valider la vente auras comme consequence
          - Mettre l'etat de la vente v_etat 1 (Valider)
          - Mettre l'etat des commandes iphones de la vente a vc_etat=1
          - Modifier la quantite du modeles de la commande iphone a +1

- [*] Gestion des commandes d'achats
  Sa reste les elements de la gestion de la commande d'achat - creer ses 3 fonctions dans actions : 1. addAchatCommande : qui prend m_id,barcode,prix,a_id dans le formData - Creer l'iphone via m_id,barcode - Puis ajoute a la commande d'achat acommande 2. deleteAchatCommande qui prend ac_id comme parametre unique de la fonction - Supprime l'iphone de la commande d'achat - Supprimer l'iphone de la commande via le i_id trouver dans accommande

        3. validateAchatCommande qui prend a_id comme parametre unique de la fonction
            Faire ses operations dans une transaction
          - Mettre l'etat de la commande d'achat a 1 (valider) a_etat=1
          - Mettre l'etat des iphones de la commande a 1 => ac_etat=1
          - Mettre a jour la quantite des modeles de la commande d'achat => m_qte=m_qte+1
          - Marque l'iphone disponible en stock => i_instock=1

- [*] Securisation des actions utilisateurs pour garantir
  la coherence des donnees !

  - Vente valider masquer le bouton de suppression => OK
  - Achat valider masquer le bouton de suppression => OK
  - Ne pas supprimer un vente qui a des commandes => OK (pour garantir la coherence des donnees)
  - Ne pas supprimer un achat qui a des commandes => OK (pour garantir la coherence des donnees)

- [*] Ameliorations de l'interface utilisateur
- [*] Trier les colonnes necessaire du data-table
- [*] Recherche dans le pannier filtre par nom et imei

- [*] Recherche globale sur l'iphone via son imei - Chercher les iphones par un imei puis afficher ses macths !

- [*] Tableaux de bord de l'application !
  Genere moi un tableaux de bord moderne , simple avec
  des animations et icones : - Quantite totals d'iphones en stock - Nombre totals de retours - Nombre totals de clients - Nombre totals de vente
  et un graphes responsive - qui affiche les top 10 modeles d'iphones le plus vendus sur x => nom de l'iphone et y => nombre de vente

- [*] Systeme de corbeille pour les modeles d'iphones
  J'ai pus le faire malgrer les contraintes

- [*] Ameliorations des perfs de l'application !

  - Mettre en cache les requetes => avec unstable_cache
  - Reduire les jointures sql si necessaires ou creer des index sur les tables
  - Creation de triggers

- [ ] Deploy en production
  1. Creation du repo github
  2. Creation de la base de donnees xata

<!-- - [ ] Gestion des prix et paiements si necessaires -->

## FEEDBACKS 🛟

Grow your apps keeps feedbacks !

## DEPLOY & PRODUCTION

- Cloud provider : vercel/me
- Data provider : xata/me
- File provider : db/external/me
- Auth provider : me/external

## NOTES

```sql : start your app easy and communicate with chat gpt
CREATE TABLE entreprises (
    en_id SERIAL PRIMARY KEY,
    en_nom VARCHAR(100) NOT NULL,
    en_tel VARCHAR(45) NOT NULL,
    en_email VARCHAR(100) NOT NULL,
    en_desc VARCHAR(256),
    en_adr VARCHAR(256),
    en_logo VARCHAR(256),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    u_prenom VARCHAR(60) NOT NULL,
    u_nom VARCHAR(30) NOT NULL,
    u_role VARCHAR(6) DEFAULT 'user',
    u_name VARCHAR(100) NOT NULL,
    u_pass VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    en_id INT NOT NULL
);

ALTER TABLE entreprises ADD CONSTRAINT entreprises_unique1 UNIQUE (en_nom),
            entreprises ADD CONSTRAINT entreprises_unique2 UNIQUE (en_tel),
            entreprises ADD CONSTRAINT entreprises_unique3 UNIQUE (en_email);

ALTER TABLE users ADD CONSTRAINT users_unique1 UNIQUE (u_prenom, u_nom),
            users ADD CONSTRAINT users_unique2 UNIQUE (u_name),
            users ADD CONSTRAINT users_unique3 UNIQUE (email),
            users ADD CONSTRAINT users_check1 CHECK (u_role IN ('root','user', 'admin')),
            users ADD CONSTRAINT users_fkey1 FOREIGN KEY (en_id)
    REFERENCES entreprises(en_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
```

### Ma stack t3 evolution

- Modal => fermer via url ou du javascript dom classique
- formatDateTime
- urlsParams prend en charge les dates

- Way to using server action
- - like some question
- 1. feedback or not => if yes using power of react
- 2. only formData or .bind(null,formData) or single param
- 3. run on client or serveur
