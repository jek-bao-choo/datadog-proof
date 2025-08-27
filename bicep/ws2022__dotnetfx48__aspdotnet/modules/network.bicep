// Network Module for Windows Server 2022 + .NET Framework v4.8.1
// Creates VNet, Subnet, and NSG with security rules for RDP and HTTP

param location string
param resourcePrefix string
param projectSuffix string
param myPublicIP string
param commonTags object

// Network Security Group with RDP and HTTP rules
resource nsg 'Microsoft.Network/networkSecurityGroups@2023-05-01' = {
  name: '${resourcePrefix}nsg-${projectSuffix}'
  location: location
  tags: commonTags
  properties: {
    securityRules: [
      {
        name: 'AllowRDP'
        properties: {
          priority: 1000
          access: 'Allow'
          direction: 'Inbound'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '3389'
          sourceAddressPrefix: myPublicIP
          destinationAddressPrefix: '*'
          description: 'Allow RDP from specific IP'
        }
      }
      {
        name: 'AllowHTTP'
        properties: {
          priority: 1010
          access: 'Allow'
          direction: 'Inbound'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '80'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          description: 'Allow HTTP for web application'
        }
      }
      {
        name: 'AllowHTTPS'
        properties: {
          priority: 1020
          access: 'Allow'
          direction: 'Inbound'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '443'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          description: 'Allow HTTPS for secure web application'
        }
      }
    ]
  }
}

// Virtual Network with address space 10.0.0.0/16
resource vnet 'Microsoft.Network/virtualNetworks@2023-05-01' = {
  name: '${resourcePrefix}vnet-${projectSuffix}'
  location: location
  tags: commonTags
  properties: {
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16']
    }
  }
}

// Subnet with NSG association
resource subnet 'Microsoft.Network/virtualNetworks/subnets@2023-05-01' = {
  parent: vnet
  name: 'default'
  properties: {
    addressPrefix: '10.0.0.0/24'
    networkSecurityGroup: {
      id: nsg.id
    }
  }
}

// Outputs for VM module
output vnetId string = vnet.id
output subnetId string = subnet.id
output nsgId string = nsg.id