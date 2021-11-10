const { clientId, brokers, topic } = require('./constants.js')

const { Kafka } = require("kafkajs")
const http = require('http');

// const clientId = "my-app"
// const brokers = ["localhost:9092"]
// const topic = "message-log"

const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

const requestListener = function (req, res) {
    if (req.url === '/api/producer') {
        res.writeHead(200);
        res.end(`
        <p>Registration form</p>
        <script>
            function hello() {
                const email = document.querySelector('.email').value
                const password = document.querySelector('.password').value
                fetch('/api/producer/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: {
                            email: email,
                            password: password
                        }
                    })
                });
                // console.log(email)
                // console.log(password)
            }
        </script>
        <form> 
            <div style="width:200px"> 
            <input type="email" placeholder="Your email" name="email" value=""
            style="width: 100%" class="email"></input>
            <br />
            <input type="password" placeholder="Your password" 
            name="password" value="" style="margin-top: 5px; width: 100%"
            class="password"></input>
            <br />

            <button type="button" style="background-color: #33b5ff; 
            margin-top: 5px; color: white; width: 100%
            " class="btn" onClick="hello()">Submit</button>
            </div>
        </form>
        `)
        return   
    }
    else if (req.url === '/api/producer/register') {

            if (req.method == 'POST') {
                var body = '';

                req.on('data', function (data) {
                    body += data;

                });

            req.on('end', function () {
                const user_data = JSON.parse(body)
                const user_email = user_data.user.email
                const user_password = user_data.user.password

                console.log(user_email)
                console.log(user_password)   

                produce(user_email, user_password)
            })

            res.writeHead(200);
            res.end(`
            <p>You have successfully registered</p>`)
            return 
    }

    res.writeHead(404);
    res.end(`Invalid url: '${req.url}'`)
    }
}

const server = http.createServer(requestListener);
server.listen(8080);

const produce = async (email, password) => {
	await producer.connect()

    send()
	async function send() {
		try {
			await producer.send({
				topic,
				messages: [
					{
						key: password,
						value: JSON.stringify({
                            email,
                            password
                        })
					}
				]
			})

			console.log(JSON.stringify({
                email,
                password
            }))
		} catch (err) {
			console.error("could not write message " + err)
		}
	}
}

