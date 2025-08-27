# Windows Server 2022 + .NET Framework v4.8.1 Bicep Deployment

This project deploys a Windows Server 2022 virtual machine in Azure Southeast Asia with IIS and a .NET Framework v4.8.1 Hello World application.

## 🏗️ Architecture Overview

- **Windows Server 2022** - Standard_D4_v5 (4 vCPUs, 16GB RAM)
- **IIS Web Server** with ASP.NET 4.8 support
- **.NET Framework 4.8.1** Hello World application
- **Virtual Network** with secure NSG rules
- **Trusted Launch** security features enabled
- **Automated deployment** via Bicep and Custom Script Extension

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
cd ws2022__dotnetfx48__aspdotnet
```

### 2. Create Parameters File
Copy the template and update with your values:
```bash
cp parameters.template.json parameters.json
```

Edit `parameters.json` and replace:
- `REPLACE_WITH_SECURE_PASSWORD` - Strong password (12+ chars, mixed case, numbers, symbols)
- `REPLACE_WITH_YOUR_IP/32` - Your public IP with /32 subnet (e.g., "203.0.113.1/32")

```bash
az login
```

### 3. Deploy Infrastructure

```bash
az deployment sub validate \
  --location southeastasia \
  --template-file main.bicep \
  --parameters @parameters.json
```

```bash
# Deploy to Azure
az deployment sub create \
  --location southeastasia \
  --template-file main.bicep \
  --parameters @parameters.json \
  --name ws2022-dotnet-deployment-v7
```

### 4. Monitor Deployment
```bash
# Check deployment status
az deployment sub show \
  --name ws2022-dotnet-deployment-v7 \
  --query "properties.provisioningState"

# Get deployment outputs
az deployment sub show \
  --name ws2022-dotnet-deployment-v7 \
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
- Password: Your specified secure password in file parameters.json

### 2. Initial Web Application Test
Open browser and navigate to:
```
http://<PUBLIC_IP>
```

**Initial Expected Results:**
- ✅ Basic HTML page loads with "Hello World Jek from .NET Framework 4.8"
- ✅ IIS is running and serving content
- ✅ Application pool is configured

### 3. Upgrade to TRUE .NET Framework 4.8 Application

**🎯 Important:** The initial deployment creates a static HTML page. Follow these steps to convert it to a real .NET Framework 4.8 application:

#### Step 1: Connect via RDP
```bash
mstsc /v:<PUBLIC_IP>
```

#### Step 2: Verify .NET Framework 4.8 Installation
Open PowerShell as Administrator and run:
```powershell
# Check .NET Framework version
Get-ItemProperty "HKLM:SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\" -Name Release

# Expected result: 528449 or higher (528449 = .NET Framework 4.8.0)
```

#### Step 3: Create Real .NET Framework 4.8 ASPX Application

1. **Navigate to:** `C:\inetpub\wwwroot\`
2. **Delete existing files** (index.html or any static content)
3. **Create `Default.aspx`** with this content:

```aspx
<%@ Page Language="C#" %>
<!DOCTYPE html>
<html>
<head>
    <title>Hello World Jek - .NET Framework 4.8 VERIFIED</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; color: #333; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h1, h2 { color: #005a9e; }
        .success { color: #107c10; font-weight: bold; }
        .info { background: #e8f4fd; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 5px solid #0078d4; }
        p { line-height: 1.6; }
        hr { border: 0; height: 1px; background: #ddd; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World Jek!</h1>
        <h2>.NET Framework 4.8 VERIFIED & WORKING</h2>

        <div class="info">
            <h3>Server Information</h3>
            <p><strong>Server Name:</strong> <%= Environment.MachineName %></p>
            <p><strong>.NET Version:</strong> <%= Environment.Version.ToString() %></p>
            <p><strong>Framework:</strong> <%= System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription %></p>
            <p><strong>Current Time:</strong> <%= DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") %></p>
        </div>

        <div class="info">
            <h3>📋 Technical Details</h3>
            <p><strong>Application Pool:</strong> JekApp (.NET Framework v4.0 runtime)</p>
            <p><strong>Deployment:</strong> Azure Bicep Template</p>
            <p><strong>Platform:</strong> Windows Server 2022</p>
        </div>

        <hr>
        <p class="footer">
            Successfully deployed .NET Framework 4.8 application via Azure Bicep!<br>
        </p>
    </div>
</body>
</html>
```

4. **Create `web.config`** in the same directory:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.web>
    <compilation targetFramework="4.8" debug="false" />
    <httpRuntime targetFramework="4.8" />
    <customErrors mode="RemoteOnly" />
  </system.web>
  <system.webServer>
    <defaultDocument>
      <files>
        <clear />
        <add value="Default.aspx" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>
```

#### Step 4: Verify the Application
1. **Refresh your browser** at `http://<PUBLIC_IP>`
2. **Confirm you see:**
   - "🎉 Hello World Jek!" heading
   - Dynamic server information (changes on refresh)
   - .NET Framework version 4.8.x
   - Green checkmarks showing verification status

### 4. Verification Checklist

#### ✅ .NET Framework 4.8 Verification:
- **Registry Release:** 528449 or higher (528449 = .NET Framework 4.8.0)
- **Framework Description:** Shows ".NET Framework 4.8.4775.0" or similar
- **Dynamic Content:** Server name, timestamp update on page refresh
- **Server-side Execution:** ASP.NET code (<%=...%>) renders correctly

#### ✅ IIS Configuration Verification:
1. **IIS Manager** → Sites → JekApp (running on port 80)
2. **Application Pools** → JekApp (uses .NET Framework v4.0)
3. **File System** → Files exist in `C:\inetpub\wwwroot\`

#### ✅ Technical Validation:
- **HTTP Response Headers:** Include `X-AspNet-Version` and `Server: Microsoft-IIS/10.0`
- **Application Pool:** Shows .NET Framework v4.0 (runs .NET Framework 4.8)
- **Web.config:** `targetFramework="4.8"` specified

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
1. **Custom Script Extension** - Single extension that:
   - Installs IIS and ASP.NET features
   - Creates application pool and website
   - Deploys .NET Framework 4.8.1 Hello World application
   - Configures web.config and restarts IIS

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
- **Most Common**: Previous PowerShell DSC timeout issue has been fixed
- Verify your public IP is correctly formatted (e.g., "1.2.3.4/32")  
- Ensure password meets complexity requirements
- Check Azure CLI is logged in: `az account show`
- If you still get errors, delete any failed resource group and retry

#### Can't RDP to VM
- Verify NSG allows your current public IP
- Check VM is running: Azure Portal > Virtual Machines
- Confirm RDP port 3389 is open

#### Website Not Loading
- Verify VM extensions completed successfully
- RDP to server and check IIS Manager
- Check Windows Firewall settings
- Review deployment logs in Azure Portal

#### Extension Issues
- **Timeout Fixed**: Replaced problematic PowerShell DSC with streamlined Custom Script Extension
- Extension typically completes in 5-10 minutes
- Check C:\WindowsAzure\Logs\Plugins\ for extension logs
- Extension now includes verbose logging for easier troubleshooting
- If still having issues, manually run scripts in scripts/ folder

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



# About the basics of .NET Framework 4.8
Of course. Here’s a breakdown of the basics of .NET Framework 4.8 and what you need to get started on Windows Server 2022.

---

### ## The Basics of .NET Framework 4.8

Think of the .NET Framework as a toolbox and a managed environment for building and running applications on Windows. It was Microsoft's primary development platform for many years. Version 4.8 is the **final major version** of this traditional framework, meaning it's now in long-term support but won't receive new features.

It has two main components:

1.  **Common Language Runtime (CLR):** This is the engine that runs your application. It manages memory, handles security, and executes your code. The CLR allows you to write code in different languages (like C# or VB.NET) that can all work together.
2.  **Framework Class Library (FCL):** This is a massive "toolbox" of pre-written, reusable code that you can use to perform common tasks like reading files, connecting to databases, managing web requests, and creating user interfaces.

With .NET Framework 4.8, you can build several types of applications:
* **Web Applications:** Using ASP.NET (Web Forms, MVC).
* **Desktop Applications:** Using Windows Forms (WinForms) or Windows Presentation Foundation (WPF).
* **Windows Services:** Applications that run in the background without a user interface.
* **APIs:** Web services that other applications can communicate with.



---

### ## Requirements for Windows Server 2022

The good news is that it's very straightforward.

**Windows Server 2022 comes with .NET Framework 4.8 pre-installed.** It's considered a part of the operating system, so you don't need to install it yourself.

To create and host a web application, you'll need two main things:

1.  **Development Environment (IDE):** You'll need an Integrated Development Environment to write, compile, and debug your code. The standard tool for this is **Microsoft Visual Studio**. You can use versions like Visual Studio 2019 or 2022. You would typically install this on your developer machine, not the server itself.
2.  **Web Server Role (IIS):** To host a web application, you need to enable the webserver role on your Windows Server. This is called **Internet Information Services (IIS)**.

To enable IIS and the necessary ASP.NET components, you use the **Server Manager**:
* Go to `Manage` > `Add Roles and Features`.
* Select `Role-based or feature-based installation`.
* Select your server.
* Under `Server Roles`, check the box for **Web Server (IIS)**.
* In the features list that appears, make sure to navigate to `Web Server (IIS)` > `Web Server` > `Application Development` and check the box for **ASP.NET 4.8**. This is a crucial step that registers the framework with IIS.

---

### ## Does It Have to Run on IIS?

This depends entirely on the **type** of application you build.

* **Yes, for Web Applications:** If you build a web application using **ASP.NET** (like your `Default.aspx` page), then for all practical purposes, **yes, it needs to run on IIS**. IIS is the native, high-performance web server on Windows that is tightly integrated with the .NET Framework and designed to host these applications.

* **No, for other application types:**
    * **Desktop Apps (WinForms/WPF):** These run directly on the Windows desktop as standard executable files (`.exe`). They don't need a web server.
    * **Windows Services:** These are installed to run in the background and are managed by the Windows Service Control Manager, not IIS.
    * **Console Applications:** These are simple programs that run from a command prompt and don't require a server.

You can verify that your .NET Framework application is running on IIS using a few straightforward methods on your Windows Server 2022.

The most direct way is to use the **IIS Manager** tool and check the server's running processes.

---

### ## 💻 Use IIS Manager

This is the primary graphical tool for managing your web server and the easiest way to check your site's status.

1.  **Open IIS Manager:** Click the Start Menu, go to **Windows Administrative Tools**, and select **Internet Information Services (IIS) Manager**. You can also press `Win + R`, type `inetmgr`, and press Enter.

2.  **Check Your Website:** On the left-hand "Connections" pane, expand your server name, then expand the **Sites** folder.

3.  **Verify the State:** Find your website in the list (it's often the "Default Web Site"). It should have a status of **Started**. If it says "Stopped," you can select it and click **Start** in the "Actions" pane on the right.

4.  **Check the Application Pool:** Every site in IIS runs in an Application Pool, which is the actual process that executes your code.
    * Select your website and click **Basic Settings...** in the Actions pane.
    * Note the name of the **Application pool**.
    * Now, in the main "Connections" pane, click on **Application Pools**. Find your application pool in the list and confirm that its status is also **Started**.

---

### ## 📜  Inspect IIS Log Files

IIS logs every request it serves. Checking these logs can confirm that traffic to your application is being handled by IIS.

1.  **Navigate to the Log Directory:** By default, IIS logs are stored in `C:\inetpub\logs\LogFiles`. Inside, there will be a folder for each site, typically named `W3SVC1` for the Default Web Site.

2.  **Open the Latest Log File:** The log files are plain text and are usually named by date (e.g., `u_ex250827.log`). Open the most recent one.

3.  **Look for Requests:** You will see entries for every resource requested from the server (pages, images, etc.). If you browse to your `Default.aspx` page and then see a new entry appear in the log file for that request, you have 100% confirmation that IIS is serving your application.

## How to Know It's a .NET Framework App
Your application has several distinct characteristics that identify it as a classic .NET Framework application.

web.config File: Your app uses a web.config file with sections like <system.web> and <compilation>. This is the hallmark of a .NET Framework web application. Modern .NET (.NET 5/6/7+) applications use appsettings.json for configuration instead.

File Types: The presence of .aspx files (like your Default.aspx) is a definitive sign. This file extension is used for ASP.NET Web Forms, a technology exclusive to the .NET Framework.

Project File Structure: If you look at the source code's project file (.csproj), a .NET Framework project file is typically very long and lists every single code file. A modern .NET project file is much shorter and more streamlined.

## 🔎 How to Verify the .NET Framework Version
There are a few places to find the exact version number your application is built to target.

1. In the web.config File (Most Direct Method)

This is the easiest way for a deployed web application. As we saw in your own file, the version is specified in two places:

XML

<system.web>
  <compilation targetFramework="4.8" />
  <httpRuntime targetFramework="4.8" />
</system.web>
The targetFramework="4.8" attribute explicitly tells IIS and the .NET runtime to use the features and libraries associated with .NET Framework 4.8.

2. On the Server (To check what's installed)

You can verify which version of the .NET Framework is installed on your Windows Server 2022. As we discussed, Windows Server 2022 comes with 4.8, but you can verify it in the Windows Registry.

Open the Registry Editor (regedit.exe).

Navigate to the path: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full

Look for a DWORD value named Release. A value of 528049 or higher indicates .NET Framework 4.8 or a later update is installed.

---

An ASPX file is a single page, ASP.NET is the framework used to build the web application, and a .NET Framework Web App is the complete, final application.

## ASPX (.aspx) - The Page
Think of an .aspx file as an individual document or a single web page within your application. It's a specific file type used by the ASP.NET Web Forms model. Its key characteristic is that it contains the user interface (UI) elements, mixing standard HTML with special ASP.NET server controls and C# or VB.NET code. When a user requests this page, IIS and the ASP.NET framework process the server-side code inside the file to generate a standard HTML page that is then sent to the user's browser.

In short: .aspx is a file extension for a single, programmable web page.

## ASP.NET - The Technology Framework
ASP.NET is the actual web development framework and a major part of the broader .NET Framework. It provides all the tools, libraries, and features needed to build dynamic, interactive web applications. ASP.NET is not a single thing but a collection of technologies. For example, it includes different programming models for building web apps:

ASP.NET Web Forms: This model uses .aspx pages and an event-driven approach, similar to desktop application development. This is the model your application uses.

ASP.NET MVC (Model-View-Controller): A newer model that separates the application into three main components (Model, View, and Controller) for better organization and testability.

In short: ASP.NET is the toolbox you use to build the entire web application.

## .NET Framework Web App - The Final Product
A .NET Framework Web App is the complete, functioning application that you deploy to the server. It's the collection of all the parts working together. This includes:

All the .aspx pages.

The compiled C# or VB.NET code in DLL files (located in the bin folder).

The web.config file that controls the application's settings.

Any images, CSS files, and JavaScript files.