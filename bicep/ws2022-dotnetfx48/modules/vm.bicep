// VM Module for Windows Server 2022 + .NET Framework v4.8.1
// Creates Public IP, NIC, VM with Trusted Launch, and VM extensions for IIS/.NET setup

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
      computerName: '${resourcePrefix}vm${projectSuffix}'
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
    securityProfile: {
      securityType: 'TrustedLaunch'
      uefiSettings: {
        secureBootEnabled: true
        vTpmEnabled: true
      }
    }
  }
}

// PowerShell DSC Extension for IIS Installation
resource iisExtension 'Microsoft.Compute/virtualMachines/extensions@2023-07-01' = {
  parent: vm
  name: 'IISConfiguration'
  properties: {
    publisher: 'Microsoft.Powershell'
    type: 'DSC'
    typeHandlerVersion: '2.83'
    autoUpgradeMinorVersion: true
    settings: {
      wmfVersion: 'latest'
      configuration: {
        url: 'https://github.com/Azure/azure-quickstart-templates/raw/master/quickstarts/microsoft.compute/vm-simple-windows/DSC/iisInstall.zip'
        script: 'iisInstall.ps1'
        function: 'InstallIIS'
      }
    }
  }
}

// Custom Script Extension for .NET Framework and Application Deployment
resource appExtension 'Microsoft.Compute/virtualMachines/extensions@2023-07-01' = {
  parent: vm
  name: 'AppDeployment'  
  dependsOn: [iisExtension]
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    typeHandlerVersion: '1.10'
    autoUpgradeMinorVersion: true
    settings: {
      commandToExecute: 'powershell.exe -ExecutionPolicy Bypass -File configure-app.ps1'
      fileUris: [
        'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.compute/vm-simple-windows/configure-app.ps1'
      ]
    }
    protectedSettings: {
      commandToExecute: 'powershell -ExecutionPolicy Bypass -Command "Import-Module WebAdministration; New-WebAppPool -Name DotNetApp -Force; Set-ItemProperty IIS:\\AppPools\\DotNetApp managedRuntimeVersion v4.0; New-Item C:\\inetpub\\wwwroot\\DotNetApp -ItemType Directory -Force; New-Website -Name DotNetApp -Port 80 -PhysicalPath C:\\inetpub\\wwwroot\\DotNetApp -ApplicationPool DotNetApp; echo \'<%@ Page Language=C# %><!DOCTYPE html><html><head><title>.NET Framework Hello World</title></head><body><h1>Hello World from .NET Framework!</h1><p>Server: <%= Environment.MachineName %></p><p>.NET Version: <%= Environment.Version %></p><p>Time: <%= DateTime.Now %></p></body></html>\' > C:\\inetpub\\wwwroot\\DotNetApp\\Default.aspx; iisreset"'
    }
  }
}

// Outputs for main template
output vmName string = vm.name
output publicIP string = publicIP.properties.ipAddress
output fqdn string = publicIP.properties.dnsSettings.fqdn