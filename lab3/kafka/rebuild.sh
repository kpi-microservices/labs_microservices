kubectl delete -f zookeeper.yaml
kubectl delete -f kafka.yaml
kubectl apply -f zookeeper.yaml
kubectl apply -f kafka.yaml