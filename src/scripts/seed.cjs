const { Pool } = require("pg");
const dsn = new Pool({
  connectionString: "postgresql://abou:abou@89@localhost:5432/dbiphonesapp2",
});

let users = {
  root: {
    id: crypto.randomUUID(),
    email: "codeurabou123@gmail.com",
    u_prenom: "Abou",
    u_nom: "Barry",
    name: "aboubacar",
    password: "abou@89",
    role: "root",
    en_id: null, // if add organisation
  },
  org: {
    en_nom: "ABOU IPHONES",
    en_tel: "+223 94 86 58 79",
    en_email: "codeurabou123@gmail.com",
    en_desc: "#1 des vendeurs d''iphones au Mali",
    en_adr: "No Room",
  },
  admin: {
    id: crypto.randomUUID(),
    email: "codeurabou@gmail.com",
    u_prenom: "Aboubacar",
    u_nom: "Barry",
    name: "abou",
    password: "12345",
    role: "admin",
    en_id: 0, // if add organisation
  },
};

// @ts-expect-error
function _sanitizeInsert(obj = {}) {
  const cols = Object.keys(obj);
  const values = Object.values(obj);
  const c = Array.isArray(cols) && cols.join(",");
  const v = Array.isArray(values) && values.map((v) => `'${v}'`).join(",");
  return {
    col: c,
    val: v,
  };
}

const withOrg = process.argv.includes("--org");

async function seed() {
  let { root, admin, org } = users;

  // with organisation modele
  if (!withOrg) {
    delete admin.en_id;
  } else {
    const entreprise = _sanitizeInsert(org);
    const result = await dsn.query(
      `insert into entreprises (${entreprise.col}) values (${entreprise.val}) returning *;`,
    );
    const id = result.rows[0]?.en_id;
    root.en_id = id;
    admin.en_id = id;
  }

  // remove en_id to root user
  // delete root.en_id;
  const user1 = _sanitizeInsert(root);
  const user2 = _sanitizeInsert(admin);

  try {
    await dsn.connect();
    await dsn
      .query(
        `insert into users (${user1.col}) 
          values (${user1.val}),
                 (${user2.val});
      `,
      )
      .then(() => console.log("users inserted !"));
  } catch (err) {
    throw err;
  }
}

seed()
  .then(() => {
    console.log("Finish to seed database !");
  })
  .catch((err) => {
    console.error(err), process.exit(1);
  });
