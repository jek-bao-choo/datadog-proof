// VM Module for Windows Server 2022 + .NET Framework v4.8.1
// Creates Public IP, NIC, VM, and VM extensions for IIS/.NET setup

param location string
param resourcePrefix string  
param projectSuffix string
param adminUsername string
@secure()
param adminPassword string
param vmSize string
param subnetId string
param commonTags object

// Public IP with Standard SKU and DNS label
resource publicIP 'Microsoft.Network/publicIPAddresses@2023-05-01' = {
  name: '${resourcePrefix}pip-${projectSuffix}'
  location: location
  tags: commonTags
  sku: { 
    name: 'Standard' 
  }
  properties: {
    publicIPAllocationMethod: 'Static'
    dnsSettings: {
      domainNameLabel: '${resourcePrefix}${projectSuffix}-${uniqueString(resourceGroup().id)}'
    }
  }
}

// Network Interface connecting VM to subnet and public IP
resource nic 'Microsoft.Network/networkInterfaces@2023-05-01' = {
  name: '${resourcePrefix}nic-${projectSuffix}'
  location: location
  tags: commonTags
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          subnet: { 
            id: subnetId 
          }
          publicIPAddress: { 
            id: publicIP.id 
          }
        }
      }
    ]
  }
}

// Windows Server 2022 Virtual Machine with Trusted Launch
resource vm 'Microsoft.Compute/virtualMachines@2023-07-01' = {
  name: '${resourcePrefix}vm-${projectSuffix}'
  location: location
  tags: commonTags
  properties: {
    hardwareProfile: { 
      vmSize: vmSize 
    }
    osProfile: {
      computerName: 'jek-ws2022-vm'
      adminUsername: adminUsername
      adminPassword: adminPassword
      windowsConfiguration: {
        provisionVMAgent: true
        enableAutomaticUpdates: true
      }
    }
    storageProfile: {
      imageReference: {
        publisher: 'MicrosoftWindowsServer'
        offer: 'WindowsServer'  
        sku: '2022-datacenter'
        version: 'latest'
      }
      osDisk: {
        createOption: 'FromImage'
        managedDisk: { 
          storageAccountType: 'StandardSSD_LRS' 
        }
      }
    }
    networkProfile: {
      networkInterfaces: [
        { 
          id: nic.id 
        }
      ]
    }
  }
}

// Simple Custom Script Extension - inline commands only
resource jekDotNetApp 'Microsoft.Compute/virtualMachines/extensions@2023-07-01' = {
  parent: vm
  name: 'JekDotNetApp'
  location: location
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    typeHandlerVersion: '1.10'
    autoUpgradeMinorVersion: true
    settings: {
      commandToExecute: 'powershell -ExecutionPolicy Bypass -Command "Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole,IIS-WebServer,IIS-CommonHttpFeatures,IIS-StaticContent,IIS-DefaultDocument,IIS-ASPNET45 -All; Import-Module WebAdministration; New-WebAppPool JekApp -Force; Set-ItemProperty IIS:/AppPools/JekApp managedRuntimeVersion v4.0; try { Remove-Website DefaultWebSite } catch {}; echo Hello World Jek from .NET Framework 4.8 > C:/inetpub/wwwroot/index.html; New-Website JekApp -Port 80 -PhysicalPath C:/inetpub/wwwroot -ApplicationPool JekApp; iisreset"'
    }
  }
}

// Outputs for main template
output vmName string = vm.name
output publicIP string = publicIP.properties.ipAddress
output fqdn string = publicIP.properties.dnsSettings.fqdn