// const { clientId, brokers, topic } = require('./constants.js')
// const { Kafka } = require('kafkajs')
// const http = require('http')
// const Pool = require('pg').Pool
// const process = require('process')
// const fs = require('fs')
import {clientId, brokers, topic} from './constants.js'
import {Kafka} from 'kafkajs'
import http from 'http';
import pkg from 'pg';
import process from 'process';
import fetch from "node-fetch";
import fs from 'fs';

const { Pool } = pkg;

const pool = new Pool({
  user: 'dmytro',
  host: 'postgres',
  database: 'userdb',
  password: '1234',
  port: 5432,
})
const kafka = new Kafka({ clientId, brokers })
const consumer = kafka.consumer({ groupId: clientId })

let if_connected = false
let token = ''

const requestListener = async function (req, res) {
    if (req.url === '/api/consumer/registered') {
        res.writeHead(200);
        // await ensureDbCreated()
        fs.readFile(process.env.JWT_PATH, { encoding: 'utf-8' }, async function(err, data) {
          if (!err) {
              console.log('received data: ' + data);
              console.log("--------------------------------")
              token = data
              const response = await fetch(`${process.env.VAULT_ADDR}/v1/auth/kubernetes/login`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                      "role": "webapp",
                      "jwt": token
                })
            });
            const json = await response.json();
            console.log(JSON.stringify(json))
            console.log("--------------------------------")
            const client_token = JSON.stringify(json["auth"]["client_token"])
            console.log(JSON.stringify(json["auth"]["client_token"]))
            console.log("--------------------------------")
            
            const response2 = await fetch(`${process.env.VAULT_ADDR}/v1/secret/data/webapp/config`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'X-Vault-Token': client_token
              }
            });

          const json2 = await response2.json();
          console.log("Received secrets: " + JSON.stringify(json2))

          } else {
              console.log(err);
          }
        });
        // console.log(process.env.JWT_PATH)

        await consume()
        setTimeout(() => {pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                throw error
              }
              const users = results.rows
              console.log(users)
              console.log("--------------------------------")

              let str = `<style> table, th, tr, td { border: 1px solid black; text-align: center;} 
              td, th { width: 50%; }</style>
              <table style="border-collapse: collapse;
              width: 100%"><th>Email</th><th>Password</th>`
              users.forEach(user => {
                str = str.concat(`
                <tr>
                  <td>${user.email}</td>
                  <td>${user.password}</td>
                </tr>
                `)
              })
              str = str.concat(`</table></div>`)

              res.end(str)
              
            })}, 6000)     
        res.write(`<div style="width: 700px"><p style="width: 100%; 
        text-align: center; margin-bottom: 0">Registered users</p><br />`)
        return   
    } 
    res.writeHead(404);
    res.end(`Invalid url: '${req.url}'`)
}


const consume = async () => {
  if (!if_connected) {
    await consumer.connect()
    await consumer.subscribe({ topic })
    if_connected = true
  }
	await consumer.run({
		eachMessage: ({ message }) => {
			console.log(`Received message: ${message.value}`)
      console.log("--------------------------------")
        const user_data = JSON.parse(message.value)
        pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', 
          [user_data.email, user_data.password], (error, results) => {
            if (error) {
              throw error
            }
          })
		},
	})
}

const ensureDbCreated = async () => {
    pool.query(`CREATE TABLE IF NOT EXISTS users (id serial primary key, 
      email varchar(255), password varchar(255);`, (error, results) => {
      if (error) {
          console.log(error)
        }
    });
}

const server = http.createServer(requestListener);
server.listen(8080);