const express = require('express');
const s3Router = express.Router();

const aws = require('aws-sdk');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, region } = process.env
aws.config.region = region;
aws.config.credentials = { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY }

const s3 = new aws.S3();
const textBucket = 'textstorage-northcoders';
const rawAudioBucket = 'rawaudiostorage-northcoders';
const mp3AudioBucket = 'mp3audiostorage-northcoders';
const mysql = require('promise-mysql');
const SQL = require('sql-template-strings');

s3Router.put(`/textstorage`, (req, res) => {
	console.log(req.body, 'HERE IS THE REQ.BODy')
	const { data, id, type } = req.body;
	console.log(id, 'id')
	const params = {
		Bucket: textBucket,
		Key: `${type}${id}.txt`,
		Body: data
	}

	s3.putObject(params, (err, data) => {
		if (err) console.log(err)
		else {
			console.log(data, 'success')
			res.status(201).json({ data });
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

s3Router.get('/sign', (req, res) => {
	const id = req.query.objectName;
	const prefix = req.query.prefix;
	const mimeType = 'audio/webm';
	const ext = '.webm';
	const fileKey = `${prefix}${id}${ext}`;

	const params = {
		Bucket: rawAudioBucket,
		Key: fileKey,
		Expires: 6000,
		ContentType: mimeType,
		ACL: 'public-read' // || 'private'
	};

	console.log('Get signed url params', params)

	// Getting pre-signed url - no actual data is being passed here
	s3.getSignedUrl('putObject', params, function (err, url) {
		if (err) {
			console.log(err);
			return res.send(500, "Cannot create S3 signed URL");
		}

		console.log('url: ', url)
		res.json({
			signedUrl: url,
			publicUrl: 'https://s3.amazonaws.com/' + params.Bucket + '/' + params.Key,
			filename: id
		});
	});
})

module.exports = s3Router;