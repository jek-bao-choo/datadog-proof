// Windows Server 2022 + .NET Framework v4.8.1 Main Template
// This template deploys a Windows Server 2022 VM with IIS and .NET Framework 4.8.1

targetScope = 'subscription'

// Parameters with no defaults for security
param adminUsername string
@secure()
param adminPassword string
param myPublicIP string
param location string = 'southeastasia'
param vmSize string = 'Standard_D4_v5'

// Resource naming with jek- prefix
var resourcePrefix = 'jek-'
var projectSuffix = 'ws2022dotnet'
var commonTags = {
  owner: 'jek'
  env: 'test'
  criticality: 'low'
}

// Create Resource Group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${resourcePrefix}rg-${projectSuffix}'
  location: location
  tags: commonTags
}

// Deploy Network Resources
module network 'modules/network.bicep' = {
  scope: rg
  name: 'networkDeployment'
  params: {
    location: location
    resourcePrefix: resourcePrefix
    projectSuffix: projectSuffix
    myPublicIP: myPublicIP
    commonTags: commonTags
  }
}

// Deploy Virtual Machine
module vm 'modules/vm.bicep' = {
  scope: rg
  name: 'vmDeployment'
  params: {
    location: location
    resourcePrefix: resourcePrefix
    projectSuffix: projectSuffix
    adminUsername: adminUsername
    adminPassword: adminPassword
    vmSize: vmSize
    subnetId: network.outputs.subnetId
    commonTags: commonTags
  }
}

// Outputs
output resourceGroupName string = rg.name
output vmPublicIP string = vm.outputs.publicIP
output vmFQDN string = vm.outputs.fqdn
output rdpCommand string = 'mstsc /v:${vm.outputs.publicIP}'
output webUrl string = 'http://${vm.outputs.publicIP}'