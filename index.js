/**
 * First Setup
 */
let BASE_URL = "https://www.sociality.my.id";
let DOMAIN = "sociality.my.id";



/**
 * Server Setup
 */
const Fastify = require('fastify')
const fs = require('fs');
const path = require('path');
let fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


/**
 * Build Setup
 */
const PORT = process.env.PORT || 3000;
const SiteMapPlugin = require('express-sitemap-xml');
const { AwesomeGraphQLClient } = require('awesome-graphql-client');
const StaticMap = require("./static_map.js");

let GraphClient = new AwesomeGraphQLClient({
					endpoint: 'https://api-ap-northeast-1.graphcms.com/v2/ckuia1cja13ab01z0ddj67tnk/master',
					fetch
				})


/**
 * SchemaQL
 */
let ArticleSchema = require('./Schema/Articles.js').schema()


/**
 * Sitemap
 */
async function sitemap(){
	let sitemap = StaticMap.map;


	let $articles = await GraphClient.request(ArticleSchema);
	
	for (var i = 0; i < $articles['posts'].length; i++) {
		sitemap.push({
			url: `${BASE_URL}/blog/${$articles['posts'][i].url}`,
			lastMod: $articles['posts'][i].lastMod
		});
	}

	return sitemap;
}


/**
 * Routes
 */
async function routes(server){

	server.get('/robots.txt', (req,reply) => {
		return reply.sendFile('./robots.txt');
	})

	server.get("/favicon.ico", (req,reply) => {
		return reply.sendFile('./favicon.ico');
	});

	server.get("/*", async (req,reply) => {
		return reply.sendFile('./index.html');
	});
}




/**
 * Build
 */
async function build () {
  	const fastify = Fastify()
  	await fastify.register(require('fastify-express'))

  	fastify.use(SiteMapPlugin(sitemap, 'https://my-topup.store'))

  	fastify.register(require('fastify-static'), {
	  	root: path.join(__dirname, 'public'),
	  	prefix: '/__miaw'
	})
  	
  	fastify.express.disabled('x-powered-by') // true

  	await routes(fastify);

  	return fastify
}


build()
  .then(fastify => fastify.listen(PORT), console.log(`Server running on PORT:${PORT}`))
  .catch(console.log)