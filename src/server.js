import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import admin from './firebase'
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

express() // You can also use Express
	.use(

		compression({ threshold: 0 }),
		sirv('static', { dev }),
		cookieParser(),
		bodyParser.json(),
		(req, res, next) => {
			const sessionCookie = req.cookies["__session"] || '';
			// Verify the session cookie. In this case an additional check is added to detect
			// if the user's Firebase session was revoked, user deleted/disabled, etc.
			admin.auth().verifySessionCookie(
				sessionCookie, true /** checkRevoked */)
				.then((decodedClaims) => {
					//serveContentForUser('/profile', req, res, decodedClaims);
					console.log(decodedClaims)
					res.currentUser = { displayName: decodedClaims.name }
					next()
				})
				.catch(error => {
					// Session cookie is unavailable or invalid. Force user to login.
					//res.redirect('/login');
					console.log(error)
					res.currentUser = null
					next()
				});
		},
		sapper.middleware({
			session: (req, res) => ({
				currentUser: res.currentUser
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});