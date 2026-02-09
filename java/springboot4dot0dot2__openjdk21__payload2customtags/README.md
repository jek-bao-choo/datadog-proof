```bash
./mvnw spring-boot:run
```

The application will start on **http://localhost:8080**

### Running the JAR File (Production)


```bash
./mvnw test
```

```bash
# Build the JAR first
./mvnw clean package

# Run the JAR
java -jar target/springboot4dot0dot2__openjdk21__payload2customtags-0.0.1-SNAPSHOT.jar
```

## Ubuntu Linux Deployment

### Step 0: SSH
```bash
ssh -i "~/.ssh/XXXXXXXX_pem" ubuntu@XXXXXXXXXXX.com
```

### Step 1: Install Java on Ubuntu

```bash
# Update package list
sudo apt update

# Install OpenJDK 17
sudo apt install openjdk-21-jdk

# Verify installation
java -version
```

### Step 2: Transfer JAR to Ubuntu Server

**Option A: Using scp (preferred)**
```bash
# From your local machine
scp -i "~/.ssh/XXXXXXXX_pem" target/springboot4dot0dot2__openjdk21__payload2customtags-0.0.1-SNAPSHOT.jar ubuntu@XXXXXXXXXXX.com:/home/ubuntu/
```

### Step 3: SSH into the Ubuntu Server
#### Installing Datadog Agent (Ubuntu)

```bash
# Install Datadog Agent
DD_API_KEY=<YOUR_API_KEY> \
DD_SITE="datadoghq.com" \
DD_ENV=testv7 \
bash -c "$(curl -L https://install.datadoghq.com/scripts/install_script_agent7.sh)"

# Verify installation
sudo systemctl status datadog-agent

# Restart agent
sudo systemctl restart datadog-agent
```

```bash
curl -Lo dd-java-agent.jar 'https://dtdg.co/latest-java-tracer'
```

Verify the download:

```bash
ls -lh dd-java-agent.jar
```
Place the JAR in your project directory (or a standard location like `/opt/datadog/`).

Run your application with the Datadog Java tracer:

```bash
# Run with dd-trace-java agent using system properties
java -javaagent:dd-java-agent.jar \
  -Ddd.service=jek-springboot-payload-to-customtag \
  -Ddd.env=jek-sandbox-v1 \
  -Ddd.version=0.0.1 \
  -Ddd.agent.host=localhost \
  -Ddd.dynamic.instrumentation.enabled=true \
  -jar target/springboot4dot0dot2__openjdk21__payload2customtags-0.0.1-SNAPSHOT.jar
```

Trigger traffic
```bash
curl localhost:8080
```


#### Step N: Kill
```bash
# Find process ID
ps aux | grep springboot4dot0dot2

# Kill process
kill <PID>

# Or force kill
pkill -f springboot4dot0dot2
```