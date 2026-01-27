# # Setting up [Azure Redhat Openshift (ARO) 4 cluster using the Azure CLI](https://learn.microsoft.com/en-us/azure/openshift) with [DDOT Collector using Datadog Operator](https://docs.datadoghq.com/opentelemetry/setup/ddot_collector/install/kubernetes_daemonset/?tab=datadogoperator) 

## [Create an Azure Red Hat OpenShift 4 cluster](https://learn.microsoft.com/en-us/azure/openshift/create-cluster?pivots=aro-azure-cli)

```bash
az --version

brew update && brew install azure-cli

az login

export LOCATION=southeastasia
az vm list-usage --location $LOCATION --query "[?contains(name.value, 'standardDSv5Family')]" --output table


az account set --subscription <SUBSCRIPTION ID>

az provider list --query "[?namespace=='Microsoft.RedHatOpenShift'].registrationState" --output table

az provider register --namespace Microsoft.RedHatOpenShift --wait

az provider register --namespace Microsoft.Compute --wait

az provider register --namespace Microsoft.Storage --wait

az provider register --namespace Microsoft.Authorization --wait

export LOCATION=southeastasia                 # the location of your cluster
export RESOURCEGROUP=jek-aro-rg            # the name of the resource group where you want to create your cluster
export CLUSTER=jek-aro-cluster                 # the name of your cluster
export VIRTUALNETWORK=jek-aro-vnet         # the name of the virtual network

az group create --name $RESOURCEGROUP --location $LOCATION

az network vnet create --resource-group $RESOURCEGROUP --name $VIRTUALNETWORK --address-prefixes 10.0.0.0/22

az network vnet subnet create --resource-group $RESOURCEGROUP --vnet-name $VIRTUALNETWORK --name master-subnet --address-prefixes 10.0.0.0/23

az network vnet subnet create --resource-group $RESOURCEGROUP --vnet-name $VIRTUALNETWORK --name worker-subnet --address-prefixes 10.0.2.0/23

az aro get-versions --location $LOCATION --output table

az aro create --resource-group $RESOURCEGROUP --name $CLUSTER --vnet $VIRTUALNETWORK --master-subnet master-subnet --worker-subnet worker-subnet --version 4.19.20
```

## [Connect to an Azure Red Hat OpenShift 4 cluster](https://learn.microsoft.com/en-us/azure/openshift/connect-cluster) 

```bash


```

## [Delete an Azure Red Hat OpenShift 4 cluster](https://learn.microsoft.com/en-us/azure/openshift/delete-cluster)

```bash
#WIP
```