# Windows Server 2022 + .NET Framework v4.8.1 Bicep Deployment

This project deploys a Windows Server 2022 virtual machine in Azure Southeast Asia with IIS and a .NET Framework v4.8.1 Hello World application.

## 🏗️ Architecture Overview

- **Windows Server 2022** - Standard_D4_v5 (4 vCPUs, 16GB RAM)
- **IIS Web Server** with ASP.NET 4.8 support
- **.NET Framework 4.8.1** Hello World application
- **Virtual Network** with secure NSG rules
- **Trusted Launch** security features enabled
- **Automated deployment** via Bicep and PowerShell DSC

## 📋 Prerequisites

1. **Azure CLI** installed and configured
2. **Azure subscription** with sufficient permissions
3. **Bicep CLI** (automatically installed with Azure CLI)
4. **Your public IP address** for RDP access

### Get Your Public IP
```bash
curl ifconfig.me
```

## 🚀 Deployment Instructions

### 1. Clone and Navigate
```bash
cd ws2022-dotnetfx48
```

### 2. Create Parameters File
Copy the template and update with your values:
```bash
cp parameters.template.json parameters.json
```

Edit `parameters.json` and replace:
- `REPLACE_WITH_SECURE_PASSWORD` - Strong password (12+ chars, mixed case, numbers, symbols)
- `REPLACE_WITH_YOUR_IP/32` - Your public IP with /32 subnet (e.g., "203.0.113.1/32")

### 3. Deploy Infrastructure
```bash
# Deploy to Azure
az deployment sub create \
  --location southeastasia \
  --template-file main.bicep \
  --parameters @parameters.json \
  --name ws2022-dotnet-deployment
```

### 4. Monitor Deployment
```bash
# Check deployment status
az deployment sub show \
  --name ws2022-dotnet-deployment \
  --query "properties.provisioningState"

# Get deployment outputs
az deployment sub show \
  --name ws2022-dotnet-deployment \
  --query "properties.outputs"
```

## 🧪 Testing the Deployment

### 1. RDP Access
Use the public IP from deployment outputs:
```bash
mstsc /v:<PUBLIC_IP>
```

**Credentials:**
- Username: `azureuser` (or your specified adminUsername)
- Password: Your specified secure password

### 2. Web Application Test
Open browser and navigate to:
```
http://<PUBLIC_IP>
```

**Expected Results:**
- ✅ Hello World page loads successfully
- ✅ Server information displayed
- ✅ .NET Framework version shows 4.8.x
- ✅ Current date/time updates on refresh

### 3. Manual Verification Steps

#### On the Server (via RDP):
1. **IIS Manager** - Verify DotNetApp site is running
2. **Application Pools** - Confirm DotNetApp pool uses .NET Framework v4.0
3. **Windows Features** - Check IIS and ASP.NET are installed
4. **File System** - Verify files exist in `C:\inetpub\wwwroot\DotNetApp\`

#### From External Browser:
1. **HTTP Access** - http://PUBLIC_IP loads the application
2. **Server Info** - Page displays correct server name and .NET version
3. **Responsive Design** - Page displays properly formatted

## 📁 Project Structure

```
ws2022-dotnetfx48/
├── main.bicep                  # Main deployment template
├── modules/
│   ├── network.bicep          # VNet, subnet, NSG
│   └── vm.bicep              # VM, extensions, public IP
├── scripts/
│   ├── configure-iis.ps1     # IIS configuration script
│   └── deploy-app.ps1        # Application deployment
├── app/
│   ├── Default.aspx          # Sample web page
│   └── web.config           # Web configuration
├── parameters.template.json  # Parameter template
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## 🔧 Configuration Details

### Azure Resources Created
- **Resource Group**: `jek-rg-ws2022dotnet`
- **Virtual Machine**: `jek-vm-ws2022dotnet`
- **Virtual Network**: `jek-vnet-ws2022dotnet` (10.0.0.0/16)
- **Subnet**: `default` (10.0.0.0/24)
- **Public IP**: `jek-pip-ws2022dotnet` (Static, Standard SKU)
- **Network Interface**: `jek-nic-ws2022dotnet`
- **Network Security Group**: `jek-nsg-ws2022dotnet`

### Security Rules
| Rule | Protocol | Port | Source | Purpose |
|------|----------|------|---------|---------|
| AllowRDP | TCP | 3389 | Your IP | Remote Desktop access |
| AllowHTTP | TCP | 80 | Any | Web application access |
| AllowHTTPS | TCP | 443 | Any | Secure web access |

### VM Extensions
1. **PowerShell DSC** - Installs IIS and ASP.NET features
2. **Custom Script** - Installs .NET Framework 4.8.1 and deploys application

## 🔒 Security Features

- **Trusted Launch** enabled with Secure Boot and vTPM
- **Network Security Group** restricts RDP to your IP only
- **Standard SKU Public IP** for enhanced security
- **No default passwords** in templates
- **Secrets excluded** from version control

## 🧹 Cleanup Instructions

To remove all deployed resources:

```bash
# Delete the entire resource group
az group delete \
  --name jek-rg-ws2022dotnet \
  --yes \
  --no-wait
```

**Warning**: This will permanently delete all resources in the resource group.

## 💰 Cost Optimization

- **Standard_D4_v5** VM size balances performance and cost
- **StandardSSD_LRS** provides good performance at lower cost
- **Auto-shutdown** can be configured in Azure portal for development

### Estimated Monthly Cost (Southeast Asia)
- VM (Standard_D4_v5): ~$140/month (when running 24/7)
- Storage (StandardSSD_LRS): ~$10/month
- Public IP (Static): ~$4/month
- **Total**: ~$154/month

*Stop the VM when not in use to reduce costs significantly*

## 🔍 Troubleshooting

### Common Issues

#### Deployment Fails
- Verify your public IP is correctly formatted (e.g., "1.2.3.4/32")
- Ensure password meets complexity requirements
- Check Azure CLI is logged in: `az account show`

#### Can't RDP to VM
- Verify NSG allows your current public IP
- Check VM is running: Azure Portal > Virtual Machines
- Confirm RDP port 3389 is open

#### Website Not Loading
- Verify VM extensions completed successfully
- RDP to server and check IIS Manager
- Check Windows Firewall settings
- Review deployment logs in Azure Portal

#### .NET Framework Issues
- Extensions may take 10-15 minutes to complete
- Check C:\WindowsAzure\Logs\Plugins\ for extension logs
- Manually run scripts in scripts/ folder if needed

### Getting Help

1. **Azure CLI Help**: `az deployment sub create --help`
2. **Bicep Documentation**: https://docs.microsoft.com/azure/azure-resource-manager/bicep/
3. **Extension Logs**: Available in Azure Portal > VM > Extensions
4. **Event Viewer**: Check Application and System logs on the VM

## 📚 Additional Resources

- [Azure Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)
- [Windows Server 2022 Documentation](https://docs.microsoft.com/windows-server/)
- [IIS Configuration Guide](https://docs.microsoft.com/iis/)
- [.NET Framework 4.8.1 Documentation](https://docs.microsoft.com/dotnet/framework/)

## 🏷️ Tags Applied

All resources are tagged with:
- `owner`: jek
- `env`: test
- `criticality`: low

---

**✅ Deployment Complete!** 

Your Windows Server 2022 with .NET Framework 4.8.1 application is ready for testing.