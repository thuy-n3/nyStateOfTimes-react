// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'backbone'


function app() {
    // start app
    // new Router()

//     Array.prototype.forAll = function(func) {
// 	    for (var i = 0; i < this.length; i ++) {
// 	     	func(this[i],i)   
// 	    }
// 	}

//     var books = [
// 	    { author: "jane austen",
// 	      title: "pride and prejudice"
// 	    },
// 	    { author: "jesus the author",
// 	      title: "quantum mechanics for dummies"
// 	    },
// 	    { author: "leo tolstoy",
// 	      title: "anna karenina"
// 	    }
// 	]

//     var Book = React.createClass({
// 	  render: function(){
// 	    return  (
//     		<div className="book">
//     			<p className="title">{this.props.litData.title}</p>
//     			<p className="author">{this.props.litData.author}</p>
//     		</div>
// 	  		)
// 	  }
// 	})

// 	var BookList = React.createClass({

// 		render: function() {
// 			var jsxArray = []

// 			var bookMaker = function(bookObject,i) {
// 				var component = <Book key={i} litData={bookObject} />
// 				jsxArray.push(component)
// 			}

// 			this.props.booksData.forAll(bookMaker)

// 			return (
// 				<div className="bookList">
// 					{jsxArray}
// 				</div>
// 				)
// 		}
// 	})

// 	DOM.render(<BookList booksData={books}/>, document.querySelector('.container'))

	var AppView = React.createClass({

		// IF YOU WANT A LOADING GIF...
		
		// componentWillMount: function(){
		// 	var self = this
		// 	this.props.articles.on('sync',function() {self.setState({gifDisplay:"none"})})
		// },

		// getInitialState: function() {
		// 	return {
		// 		gifDisplay: "block"
		// 	}
		// },

		componentWillMount: function(){
			var self = this
			this.props.articles.on('sync',function() {self.forceUpdate()})
		},

		render: function() {
			console.log('rendering app')

			// var imgStyle = {
			// 	display: this.state.gifDisplay
			// }

			return (
				<div className="newsContainer" >
					<Header />
					{/*<img style={imgStyle} src="http://img.ffffound.com/static-data/assets/6/f71fbabb835aebca4489ba2e0d5cd6aff3ad528c_m.gif" />*/}
					<Scroll articles={this.props.articles} />
				</div>
				)
		}
	})

	var Header = React.createClass({
		render: function() {
			return (
				<div className="titleContainer">
					<h1 className="pageTitle">This Justin!</h1>
					<h3 className="subTitle">All the news that's fit to pimp</h3>
				</div>
				)
		}
	})

	var Scroll = React.createClass({
		_getArticlesJsx: function(articlesArr) {
			// method 1
			var jsxArray = []
			articlesArr.forEach(function(articleObj) {
				var component = <Article article={articleObj} />
				jsxArray.push(component)
			})

			// method 2
			var jsxArray =[]
			for (var i = 0; i < articlesArr.length; i ++) {
				var component = <Article key={i} article={articlesArr[i]} />
				jsxArray.push(component)
			}
			return jsxArray
		},

		render: function() {
			return (
				<div className="articleScroll">
					{this._getArticlesJsx(this.props.articles.models)}
				</div>
				)
		}
	})

	var Article = React.createClass({

		render: function() {
			var articleModel = this.props.article
			var imgSrc = "http://41.media.tumblr.com/30b1b0d0a42bca3759610242a1ff0348/tumblr_nnjxy1GQAA1tpo3v2o1_540.jpg"
			if (articleModel.get('multimedia').length > 0) {
				imgSrc = "http://nytimes.com/" + articleModel.get('multimedia')[0].url
			}

			return (
				<div className="article">
					<p className="headline">{articleModel.get('headline').main}</p>
					<img src={imgSrc} />
					<p className="leadPar">{articleModel.get('lead_paragraph')}</p>
				</div>
				)
		}
	})

	var NewsModel = Backbone.Model.extend({
		defaults: {
			multimedia: [
				{url: ''}
			]
		}
	})

	var NewsCollection = Backbone.Collection.extend({
		url: "http://api.nytimes.com/svc/search/v2/articlesearch.json",
		_apiKey: "11eaa2ee2ebb78f1cfb25971ad39c74d:6:60564213",

		parse: function(rawJSON) {
			return rawJSON.response.docs
		},

		model: NewsModel
	})


	var NewsRouter = Backbone.Router.extend({

		routes: {
			"articleSearch/:query": "searchFor"
		},

		searchFor: function(query) {

			var coll = new NewsCollection()
			coll.fetch({
				data: {
					q: query,
					"api-key": coll._apiKey
				}
			})
			DOM.render(<AppView articles={coll} />, document.querySelector('.container'))
		},

		initialize: function() {
			Backbone.history.start()
		}
	})

	var rtr = new NewsRouter()
}

app()
