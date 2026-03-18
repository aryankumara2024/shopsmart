const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// CREATE: POST /api/products
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    // ensure features and colors are valid JSON strings if provided as arrays
    if (Array.isArray(data.features)) data.features = JSON.stringify(data.features);
    if (Array.isArray(data.colors)) data.colors = JSON.stringify(data.colors);

    const product = await prisma.product.create({ data });
    res.status(201).json({ product });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// READ: GET /api/products/categories/list
router.get("/categories/list", async (req, res) => {
  try {
    const products = await prisma.product.findMany({ select: { category: true } });
    const categories = [...new Set(products.map((p) => p.category))].sort();
  const express = require("express");
c (const prisma = require("../lib/pries
const router = express.Router();

// Cn({
// CREATE: POST /api/products
 })router.post("/", async (req,/p  try {
    const data = req.body;
  es    co
     // ensure features anry    if (Array.isArray(data.features)) data.features = JSON.stringify(data.feans    if (Array.isArray(data.colors)) data.colors = JSON.stringify(data.colors);

     
    const product = await prisma.product.create({ data });
    res.status(20  i    res.status(201).json({ product });
  } catch (err) {
oa  } catch (err) {
    console.error("ad    console.erroif    res.status(500).json({ error: "Internal ser{   }
});

// READ: GET /api/products/categories/list
router.get("/categories/list",eg})y:
/ corouter.get("/categories/list", async (reqet  try {
    const products = await prisma.product.fy     coic    const categories = [...new Set(products.map((p) => p.category))].sort();
  conls  const express = require("express");
c (const prisma = require("../lib/pri= c (const prisma = require("../lib/prc"const router = express.Router();

// Cde
// Cn({
// CREATE: POST /api/p   // CREpa })router.post("/", async (r
     const data = req.body;
  es    co
 im  es    co
     // ensure s     // ege
     
    const product = await prisma.product.create({ data });
    res.status(20  i    res.status(201).json({ product });
  } catch (err) {
oa  } catch (err) {
    console.error("ad })          res.status(20  i    res.status(201).json({ product })at  } catch (err) {
oa  } catch (err) {
    console.error("uroa  } catch (err J    console.error(es});

// READ: GET /api/products/categories/list
router.get("/categories/list",eg})y:
/ cor p
/ducrouter.get("/categories/list",eg})y:
/ co{
/ corouter.get("/categories/list", t:    const products = await prisma.product.fy     coicge  conls  const express = require("express");
c (const prisma = require("../lib/pri= c (const prisma = require("../lib/prc"const stc (const prisma = require("../lib/pri= c (cro
// Cde
// Cn({
// CREATE: POST /api/p   // CREpa })router.post("/", async (r
     const data = req.body;
  odu// Cnaw// CREis     const data = req.body;
  es    co
 im  es    co
     // i  es    co
 im  es    co
 at im  es  so     // ensuNo     
    const product = uc    at    res.status(20  i    res.status(201).json({ product })[]  } catch (err) {
oa  } catch (err) {
    console.error("t.oa  } catch (err      console.error(odoa  } catch (err) {
    console.error("uroa  } catch (err J    console.error(es});

// READ: GET /api/proor    console.error( e
// READ: GET /api/products/categories/list
router.get("/catet("router.get("/categories/list",eg})y:
/ coco/ cor p
/ducrouter.get("/categoriesis/ducroda/ co{
/ corouter.get("/categories/list"ng/ codac (const prisma = require("../lib/pri= c (const prisma = require("../lib/prc"const stc (const prisma = require("../lib/pri= c (cro
// Cup// Cde
// Cn({
// CREATE: POST /api/p   // CREpa })router.post("/", async (r
     const data = req.body;
  odu// Cnaw// CREis    at// Cndu// CREor     const data = req.body;
  odu// Cnaw// CREis     const d e  odu// Cnaw// CREis     cTE  es    co
 im  es    co
     // i  es    co
 ", im  es  eq     // i  e   im  es    co
 at is at im  es  el    const product = uc    at     }oa  } catch (err) {
    console.error("t.oa  } catch (err      console.error(odoa  } catch (err) {
     r    console.error(n(    console.error("uroa  } catch (err J    console.error(es});

// READ: GE cat << 'EOF' > /tmp/new_products.js
const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// CREATE: POST /api/products
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (Array.isArray(data.features)) data.features = JSON.stringify(data.features);
    if (Array.isArray(data.colors)) data.colors = JSON.stringify(data.colors);

    const product = await prisma.product.create({ data });
    res.status(201).json({ product });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// READ: GET /api/products/categories/list
router.get("/categories/list", async (req, res) => {
  try {
    const products = await prisma.product.findMany({ select: { category: true } });
    const categories = [...new Set(products.map((p) => p.category))].sort();
    res.json({ categories });
  } catch (err) {
    console.error("Categories errorconst express = require("express");{ const prisma = require("../lib/pri
 
const router = express.Router();

// Cer.
// CREATE: POST /api/products
  trouter.post("/", async (req,ea  try {
    const data = req.body;
  li    coad    if (Array.isArray(datns    if (Array.isArray(data.colors)) data.colors = JSON.stringify(data.colors);

     
    const product = await prisma.product.create({ data });
    res.status(20  i    res.status(201).json({ product });
  } catch (err) {
oa  } catch (err) {
    console.error("ad    console.erroif    res.status(500).json({ error: "Internal ser{   }
});

// READ: GET /api/products/categories/list
router.get("/categories/list",eg})y:
/ corouter.get("/categories/list", async (reqet  try {
    const products = await prisma.product.fy     coic    const categories = [...new Set(products.map((p) => p.category))].sort();
    rls    res.json({ categories });
  } catch (err) {
    console.error("Categori=   } catch (err) {
    consolws    console.erroel 
const router = express.Router();

// Cer.
// CREATE: POST /api/products
  trouter.post("/", async (req,cons
// Cer.
// CREATE: POST /api/plim// CRE 1  trouter.post("/", async (rge    const data = req.body;
  li    coadts  li    coad    if (Arraymi
     
    const product = await prisma.product.create({ data });
    res.status(20  i    res.status(201).json({ pro })          res.status(20  i    res.status(201).json({ product })    } catch (err) {
oa  } catch (err) {
    console.error("esoa  } catch (errlo    console.error(N.});

// READ: GET /api/products/categories/list
router.get("/categories/list",eg})y:
/ corgi
/tiorouter.get("/categories/list",eg})y:
/ co: / corouter.get("/categories/list", ,
    const products = await prisma.product.fy     coic
     rls    res.json({ categories });
  } catch (err) {
    console.error("Categori=   } catch (err) {
    consolws    console.errv  } catch (err) {
    console.error /    console.erro
r    consolws    console.erroel 
const router  {const router = express.Router(sm
// Cer.
// CREATE: POST /api/p id// CREpa  trouter.post("/", async (rct// Cer.
// CREATE: POST /api/plim/ro// CREt   li    coadts  li    coad    if (Arraymi
     
    const product = await prisma.product [     
    const product = await prisma.p J    pa    res.status(20  i    res.status(201).json({ pro })    
 oa  } catch (err) {
    console.error("esoa  } catch (errlo    console.error(N.});

// READ: GET /api/products/categories/list
router.;
    console.error(pi
// READ: GET /api/products/categories/list
router.get("/cate{
 router.get("/categories/list",eg})y:
/ cosA/ corgi
/tiorouter.get("/categories= /tiorotr/ co: / corouter.get("/categories/list"Ar    const products = await prisma.productng     rls    res.json({ categories });
  } catch (errpr  } catch (err) {
    console.error(q.    console.erro      consolws    console.errv  } catch (err) {ca    console.error /    console.erro
r    cont r    consolws    console.erroel 
c.jconst router  {const router = err// Cer.
// CREATE: POST /api/p id// CREpa  trots// CREou// CREATE: POST /api/plim/ro// CREt   li    coadts  li    coad    if du     
    const product = await prisma.product [     
    const product = aw c     (    const product = await prisma.p J    pa    :" oa  } catch (err) {
    console.error("esoa  } catch (errlo    console.error(N.});

// READ: GET ut    console.error("w_
// READ: GET /api/products/categories/list
router.;
    consrourouter.;
    console.error(pi
// READ: G node -e "const fs = require('fs'); const code = \`const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (Array.isArray(data.features)) data.features = JSON.stringify(data.features);
    if (Array.isArray(data.colors)) data.colors = JSON.stringify(data.colors);
    const product = await prisma.product.create({ data });
    res.status(201).json({ product });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

router.get('/categories/list', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ select: { category: true } });
    const categories = [...new Set(products.map((p) => p.category))].sort();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (rconst prisma = require('../lib/prisma');

const router = express.Router();

router.poim
const router = express.Router();

routre 
router.post('/', async (req, rory  try {
    const data = req.body;
  ;
    co (    if (Array.isArray(dat .    if (Array.isArray(data.colors)) data.colors = JSON.stringify(data.colors);
    er    const product = await prisma.product.create({ data });
    res.status(201 i    res.status(201).json({ product });
  } catch (err) {
s:  } catch (err) {
    console.error(' c    console.erro}     res.status(500).json({ error: 'Internal ser    }
});

router.get('/categories/list', async (req, res) => {
  try {
    const pre:})as
r };  try {
    const products = await prisma.product.fic    cosc    const categories = [...new Set(products.map((p) => p.category))].sort();
    rrt    res.json({ categories });
  } catch (err) {
    res.status(500).json({ t'  } catch (err) {
    res.stsc    res.status(5pa  }
});

router.get('/', async (rconst prisma = require('../ar})In
rlim
const router = express.Router();

router.poim
const router = e co
router.poim
const router = expaitconst routll
routre 
router.post('/', asyncy({router,     const data = req.body;
  ;
    co ( p  ;
    co (    if (Arrayre  ),    er    const product = await prisma.product.create({ data });
    res.status(201 i    res.status(201).json({ (p    res.status(201 i    res.status(201).json({ product });
  } :   } catch (err) {
s:  } catch (err) {
    console.error('dus:  } catch (errat    console.error(um});

router.get('/categories/list', async (req, res) => {
  try {
    const pre:})as
r }; })
r  }  try {
    const pre:})as
r };  try {
    const prnt    coser };  try {
    c }    const er    rrt    res.json({ categories });
  } catch (err) {
    res.status(500).json({ t'  } catch (err) {
    res.stsc    res.status;
  } catch (err) {
    res.status(50(4    res.status(5:     res.stsc    res.status(5pa  }
});

routert.});

router.get('/', async (rconat
res)rlim
const router = express.Router();

router.poim
constprconct
router.poim
const router = e crodconst rout} router.poim
const reconst rout00routre 
router.post('/', asyncy( erouter})  ;
    co ( p  ;
    co (    if (Arrayre  ),    er    con{
        co (     r    res.status(201 i    res.status(201).json({ (p    res.status(201 i    res.status(201).js)  } :   } catch (err) {
s:  } catch (err) {
    console.error('dus:  } catch (errat    console.error(um}); ps:  } catch (err) {
   w    console.error(ra
router.get('/categories/list', async (req, res) => {
  try {{
   try {
    const pre:})as
r }; })
r  }  try {
    rr    co;
r }; })
r  }  tryelr  }  :i    const (rr };  try {
    cry    const it    c }    const er    rrt    re{   } catch (err) {
    res.status(500).json({ t'  } cat}     res.status(5      res.stsc    res.status;
  } catch (err) {r   } catch (err) {
    res..e    res.status(5
\});

routert.});

router.get('/', async (rconat
res)rl rm /Users/aryankumar/Desktop/shopsmart/server/src/routes/products.js
 cat /Users/aryankumar/Desktop/shopsmart/server/src/routes/products.js
 ls -l /Users/aryankumar/Desktop/shopsmart/server/src/routes/products.js
 ls -l /Users/aryankumar/Desktop/shopsmart/server/src/routes/products.js
 cat server/package.json
 ls -l server/prisma/seed.js
 cat << 'EOF' > server/prisma/run-seed.js
const prisma = require('../src/lib/prisma');
const fs = require('fs');
const path = require('path');

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf8'));
  for (const item of data) {
    await prisma.product.create({
      data: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        category: item.category,
        rating: item.rating,
        reviews: item.reviews,
        badge: item.badge,
        image: item.image,
        inStock: item.inStock,
        stock: item.stock || 10,
        features: JSON.stringify(item.features || []),
        colors: JSON.stringify(item.colors || [])
      }
    });
  }
  console.log("Seeded", data.length, "products");
}
main().catch(console.error).finally(() => prisma.$disconnect());
