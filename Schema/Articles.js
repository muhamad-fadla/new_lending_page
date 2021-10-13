module.exports = {
	schema(){
		return `
			query getArticles{
				posts() {
				    lastMod: createdAt
				    url: slug
				}
			}
		`;
	}
}