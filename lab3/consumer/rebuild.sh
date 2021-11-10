docker build -t consumer .
kubectl delete -f consumer.yaml
kubectl apply -f consumer.yaml