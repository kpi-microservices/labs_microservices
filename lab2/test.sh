echo -e "Running 100 requests before break:"
go run main.go
echo

sleep 1
echo -e "Breaking one of the service-js-2 pods:"
curl "http://$(minikube ip)/api/service-js-2/break"
echo

sleep 1
echo -e "Running 100 requests after break (2 healthy pods, 1 with 5 second sleeps):"
go run main.go
echo
