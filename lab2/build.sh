if ! minikube ip; then
	minikube start --driver=kvm2
fi
eval $(minikube -p minikube docker-env)
curr=$(pwd)
cd $curr/services/service_py              && docker build -t avovchenko01/service-py .
cd $curr/services/service_js/service-js-1 && docker build -t avovchenko01/service-js-1 .
cd $curr/services/service_js/service-js-2 && docker build -t avovchenko01/service-js-2 .

