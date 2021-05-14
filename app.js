const Koa = require("koa");
const KoaRouter = require("koa-router");
const json = require("koa-json");
const path = require("path");
const render = require("koa-ejs");
const bodyParser = require("koa-bodyparser");
const { isContext } = require("vm");

const app = new Koa();
const router = new KoaRouter();

// DB connection
const things = ["Family", "Tea", "Coffee", "Chocolate", "Football", "Coding"];

// JSON Prettier middleware
app.use(json());

// BodyParser Middleware
app.use(bodyParser());

// Add anything to context object
app.context.user = "Halitos";

// Basic response middleware
// app.use((ctx) => {
//   ctx.body = { msg: "Hello Koa" };
// });

render(app, {
  root: path.join(__dirname, "views"),
  layout: "layout",
  viewExt: "html",
  cache: false,
  debug: false,
});

//Routes
router.get("/", index);
router.get("/add", showAdd);
router.post("/add", add);

// List of things
async function index(ctx) {
  await ctx.render("index", {
    title: "Things I liked again",
    things,
  });
}

// Show add page
async function showAdd(ctx) {
  await ctx.render("add");
}

// Add new thing
async function add(ctx) {
  const body = await ctx.request.body;
  things.push(body.thing);
  ctx.redirect("/");
}

router.get("/test", (ctx) => {
  ctx.body = { msg: `Hello ${ctx.user}` };
});

// Check params
router.get("/test01/:name", (ctx) => {
  ctx.body = { msg: `Hello ${ctx.params.name}` };
});

// Router Middleware
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server started");
});
