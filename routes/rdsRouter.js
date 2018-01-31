

const express = require('express');
const rdsRouter = express.Router();

const textBucket = 'textstorage-northcoders';
const rawAudioBucket = 'rawaudiostorage-northcoders';
const mp3AudioBucket = 'mp3audiostorage-northcoders';
const aws = require('aws-sdk');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, region } = process.env
aws.config.region = region;
aws.config.credentials = { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY }

const s3 = new aws.S3();
const mysql = require('promise-mysql');
const SQL = require('sql-template-strings');

rdsRouter.put('/users', (req, res) => {
	const { first_name, surname, answerer, questioner, region, email, user_password, gender, dob, occupation } = req.body;
	console.log(req.body);

	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const qry = SQL`
            INSERT 
            INTO users (first_name, surname, answerer, questioner, region, email, user_password, gender, dob, occupation) 
            VALUES (${first_name}, ${surname}, ${answerer}, ${questioner}, ${region}, ${email}, ${user_password}, ${gender}, ${dob}, ${occupation})`;
			console.log(qry);
			const result = connection.query(qry)
			connection.end();
			return result;
		})
		.then(data => {
			console.log(data);
			res.status(201).send()
		})
		.catch(err => console.log(err));
})

//
rdsRouter.put('/questions', (req, res) => {
	const { user_id, topic, keywords, answered} = req.body;
	console.log(req.body);

	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const qry = SQL`
            INSERT 
            INTO questions (user_id, topic, keywords, answered) 
            VALUES (${user_id}, ${topic}, ${keywords},  ${answered})`;
			const result = connection.query(qry)
			connection.end();
			return result;
		})
		.then(data => {
			res.status(201).json({ questionId: data.insertId })
		})
		.catch(err => console.log(err));
})
//
rdsRouter.put('/answers', (req, res) => {
	const { user_id, question_id } = req.body;

	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const qry = SQL`
            INSERT 
            INTO answers (user_id, question_id) 
            VALUES (${user_id}, ${question_id})`;
			const result = connection.query(qry)
			connection.end();
			return result;
		})
		.then(data => {
			res.status(201).json({ answerId: data.insertId })
		})
		.catch(err => console.log(err));
})

rdsRouter.get('/users', (req, res) => {
	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const users = connection.query("SELECT * FROM users")
			connection.end();
			return users;
		})
		.then(users => {
			res.json({ users });
		})
		.catch(err => console.log(err));
})

rdsRouter.get('/users/:user_id', (req, res) => {
	const id = req.params.user_id;
	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const user = connection.query(SQL`SELECT * FROM users WHERE id = ${id}`)
			connection.end();
			return user;
		})
		.then(userArr => {
			const user = userArr[0]
			res.json( user );
		})
		.catch(err => console.log(err));
})

rdsRouter.get('/questions', (req, res) => {
	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const questions = connection.query("SELECT * FROM questions WHERE text_in_bucket = 1")
			connection.end();
			return questions;
		})
		.then(questions => {
			res.json({ questions });
		})
		.catch(err => console.log(err));
})

rdsRouter.get('/questions/:question_id', (req, res) => {
	const id = req.params.question_id;
	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const question = connection.query(SQL`SELECT * FROM questions WHERE id = ${id}`)
			connection.end();
			return question;
		})
		.then(questionArr => {
			const question = questionArr[0]
			res.json({ question });
		})
		.catch(err => console.log(err));
})

rdsRouter.get('/questions/:question_id/answers', (req, res) => {
	const id = req.params.question_id;
	mysql.createConnection({
		host: process.env.host,
		port: process.env.port,
		user: process.env.user,
		password: process.env.password,
		database: process.env.database
	})
		.then(connection => {
			const answers = connection.query(SQL`SELECT * FROM answers WHERE question_id = ${id}`)
			connection.end();
			return answers;
		})
		.then(answers => {
			res.json({ answers });
		})
		.catch(err => console.log(err));
})

module.exports = rdsRouter;