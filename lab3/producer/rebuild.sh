docker build -t producer .
kubectl delete -f producer.yaml
kubectl apply -f producer.yaml