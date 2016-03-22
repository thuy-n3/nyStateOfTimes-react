console.log('hello world')

// store some global variables
var Model = function(inputURL,inputKey) {
	this.baseURL = inputURL
	this.key = inputKey
	this.data = null
	this.onSync = null //function that the model will run when promise is fulfilled

	this.fetch = function(paramObject) {
		var promise = $.getJSON(this.baseURL,paramObject)
		var handleData = function(responseData) {
			this.data = this.parse(responseData)
			this.onSync()
		}
		var boundHandler = handleData.bind(this)
		promise.then(boundHandler)
		return promise
	}

	this.parse = function(rawData) {
		return rawData.response.docs
	}
}

var View = function(container,inputModel) {
	this.el = container
	this.model = inputModel
	this.render = function() {
		this.el.innerHTML = this.model.data[0].lead_paragraph
	}
	var boundRender = this.render.bind(this)
	this.model.onSync = boundRender
}



// http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=11eaa2ee2ebb78f1cfb25971ad39c74d:6:60564213&q=rubio

var headlineContainer = document.querySelector("#headlineContainer")

var timesModel = new Model("http://api.nytimes.com/svc/search/v2/articlesearch.json","11eaa2ee2ebb78f1cfb25971ad39c74d:6:60564213")
var timesView = new View(headlineContainer,timesModel)

timesModel.fetch({"api-key": timesModel.key, q: "brazil"})

