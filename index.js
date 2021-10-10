const express = require('express');
const expressSitemapXml = require('express-sitemap-xml')

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

app.use((req,res,next) => {
	 res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  next();
})

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