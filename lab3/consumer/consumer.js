const { clientId, brokers, topic } = require('./constants.js')
const { Kafka } = require('kafkajs')
const http = require('http')
const Pool = require('pg').Pool

const pool = new Pool({
    user: 'dmytro',
    host: 'postgres',
    database: 'userdb',
    password: '1234',
    port: 5432,
  })
// const { Kafka } = require("kafkajs")
// const http = require('http');
// const clientId = "my-app"
// const brokers = ["localhost:9092"]

const kafka = new Kafka({ clientId, brokers })
const consumer = kafka.consumer({ groupId: clientId })
// const consumer_2 = kafka.consumer({ groupId: clientId })

let if_connected = false

const requestListener = async function (req, res) {
    // await consumer.connect()
    // await consumer.subscribe({ topic })
    if (req.url === '/api/consumer/registered') {
        res.writeHead(200);
        // res.end('Registered users');
        //await ensureDbCreated()
        await consume()
        setTimeout(() => {pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                throw error
              }
              const users = results.rows
              console.log(users)

              str = `<style> table, th, tr, td { border: 1px solid black; text-align: center;} 
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
              
            })}, 5000)     
        res.write(`<div style="width: 700px"><p style="width: 100%; 
        text-align: center; margin-bottom: 0">Registered users</p><br />`)
        return   
    } 
    // else if (req.url === '/api/consumer/dashboard') {
    //   res.writeHead(200);
    //   await consume2()
    //   res.end(`<p>${counter}</p>`)
    //   return 
    // }
    // else if (req.url === '/api/consumer/test') {
    //   res.writeHead(200);
    //   setTimeout(() => {pool.query('SELECT * FROM users', (error, results) => {
    //     if (error) {
    //         throw error
    //       }
    //       const users = results.rows
    //       console.log(users)

    //       str = `<style> table, th, tr, td { border: 1px solid black; text-align: center;} 
    //       td, th { width: 50%; }</style>
    //       <table style="border-collapse: collapse;
    //       width: 100%"><th>Email</th><th>Password</th>`
    //       users.forEach(user => {
    //         str = str.concat(`
    //         <tr>
    //           <td>${user.email}</td>
    //           <td>${user.password}</td>
    //         </tr>
    //         `)
    //       })
    //       str = str.concat(`</table></div>`)

    //       res.end(str)
          
    //     })}, 3000)     
    // res.write(`<div style="width: 700px"><p style="width: 100%; 
    // text-align: center; margin-bottom: 0">Registered users</p><br />`)
    // return   
    // }
    res.writeHead(404);
    res.end(`Invalid url: '${req.url}'`)
}



const consume = async () => {
  if (!if_connected) {
    await consumer.connect()
    await consumer.subscribe({ topic })
    if_connected = true
  }
  // await consumer.connect()
  // await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: ({ message }) => {
			console.log(`Received message: ${message.value}`)
        const user_data = JSON.parse(message.value)
        pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', 
          [user_data.email, user_data.password], (error, results) => {
            if (error) {
              throw error
            }
          })
		},
	})
  // await consumer.disconnect()
}


// const consume2 = async () => {
//   if (!if_connected) {
//     await consumer.connect()  
//     await consumer.subscribe({ topic })
//     if_connected = true
//   }
// 	await consumer.run({
// 		eachMessage: ({ message }) => {
// 			console.log(`Received message: ${message.value}`)
//       counter += 1
// 		},
// 	})
//   // await consumer.disconnect()
// }

const ensureDbCreated = async () => {
    pool.query(`CREATE TABLE IF NOT EXISTS users (id serial primary key, 
      email varchar(255), password varchar(255);`, (error, results) => {
      if (error) {
          console.log(error)
        }
    });
}

// const consumer = kafka.consumer({ groupId: clientId })

// const consume = async () => {
// 	// first, we wait for the client to connect and subscribe to the given topic
// 	await consumer.connect()
// 	await consumer.subscribe({ topic })
// 	await consumer.run({
// 		// this function is called every time the consumer gets a new message
// 		eachMessage: ({ message }) => {
// 			// here, we just log the message to the standard output
// 			console.log(`received message: ${message.value}`)
// 		},
// 	})
// }

// const producer = kafka.producer()

// // we define an async function that writes a new message each second
// const produce = async () => {
// 	await producer.connect()
// 	let i = 0

// 	// after the produce has connected, we start an interval timer
// 	setInterval(async () => {
// 		try {
// 			// send a message to the configured topic with
// 			// the key and value formed from the current value of `i`
// 			await producer.send({
// 				topic,
// 				messages: [
// 					{
// 						key: String(i),
// 						value: "this is message " + i,
// 					},
// 				],
// 			})

// 			// if the message is written successfully, log it and increment `i`
// 			console.log("writes: ", i)
// 			i++
// 		} catch (err) {
// 			console.error("could not write message " + err)
// 		}
// 	}, 1000)
// }

// produce()
// consume()


const server = http.createServer(requestListener);
// server.listen(8081);
server.listen(8080);