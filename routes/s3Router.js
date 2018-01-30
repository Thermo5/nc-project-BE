const express = require('express');
const s3Router = express.Router();

const aws = require('aws-sdk');

const { accessKeyId, secretAccessKey, region } = require('../config')
aws.config.region = region;
aws.config.credentials = { accessKeyId, secretAccessKey }

const s3 = new aws.S3();
const textBucket = 'textstorage-northcoders';
const rawAudioBucket = 'rawaudiostorage-northcoders';
const mp3AudioBucket = 'mp3audiostorage-northcoders';
const mysql = require('promise-mysql');
const SQL = require('sql-template-strings');

s3Router.put(`/textstorage`, (req, res) => {
	console.log(req.body,'HERE IS THE REQ.BODy')
	const { id, questionText } = req.body;
	console.log(id, 'id')
	const params = {
		Bucket: textBucket,
		Key: `q${id}.txt`,
		Body: questionText
	}

	s3.putObject(params, (err, data) => {
		if (err) console.log(err)
		else {
			console.log(data, 'success')
			res.status(201).json({question: data});
		}
	})
})

s3Router.get('/textstorage', (req, res) => {
	const key = req.query.keyName;   /// keyname on the query
	const params = {
		Bucket: textBucket,
		Key: key + '.txt'
	}
	let getObjectPromise = s3.getObject(params).promise();
	getObjectPromise.then((data) => {

		return data.Body.toString('utf8')
	})
		.then((text) => {
			res.json({ text })
		})
		.catch((err) => {
			console.log(err)
		})
})

module.exports = s3Router;