const express = require('express');
const expressSitemapXml = require('express-sitemap-xml')
const dnsPrefetchControl = require('dns-prefetch-control')
const fs = require('fs')
const app = express();
const path = require('path')

function getUrls(){
	return [
		{
  			url: '/',
	  		lastMod: new Date('2021-09-01').toISOString(), // optional (specify `true` for today's date)
	  		changeFreq: 'weekly', // optional
	  		// priority: 1,
		}
	];
}

app.set('env', 'production')
app.set('cache', true)
app.disable('x-powered-by')

app.use(expressSitemapXml(getUrls, 'https://my-topup.store'))
app.use(dnsPrefetchControl({ allow: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', async (req,res) => {
	let file;

	console.log(typeof cached == "undefined")

	if(typeof cached == 'undefined'){
		console.log('Storage cached')
		file = fs.readFileSync(path.join(__dirname, 'public/index.html'));
		cached = file;
	}else{
		console.log('use cached')
		file = cached;
	}


	res.status(200).end(file);
})


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));