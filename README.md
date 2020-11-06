# Installing & Configuring Apache
1. ### Update system
	```	
	sudo apt-get update 
	```

2. ### Install Apache
	```
	sudo apt install apache2 –y
	```


3. ### Allow apache to serve React apps
	``` 
	sudo pcmanfm
	```

4. ### Configure Apache settings
	Navigate to 
	``` 
	etc/apache2/apache2.conf 
	```
	 Add the following to the file
	```
	<Directory /var/www/>
		Options Indexes FollowSymLinks
		AllowOverride all
		Options -Multiviews

		Require all granted
	</Directory>

	ProxyPass /api/ http://localhost:5000/api/
	```

5. ### Configure Apache to run React apps
	```
	sudo a2enmod proxy
	sudo a2enmod proxy_http
	sudo systemctl restart apache2
	```

6. ### Check server status
	```
	systemctl status apache2.service
	```

7. ### Give FTP access to server
	Need to have SSH enabled
   ```
   sudo chown -R pi:pi /var/www/ 
   ```


# Installing & Configuring Mosquitto
1. ### Update system
   ```
   sudo apt-get update
   ```

2. ### Install Mosquitto
   ```
   sudo apt-get install -y mosquitto mosquitto-clients
   ```

3. ### Reboot

4. ### Start the Mosquitto service
   ```
   sudo systemctl enable mosquitto.service
   ```

# Install Node
```
	sudo apt-get install nodejs
	sudo apt-get install npm
```
	
# Update npm
```
	Sudo npm install npm@latest -g
```


# Mosquitto Commands
## Subscribe to all	
```
mosquitto_sub -h localhost -t “#”
```

## Subscript to specific topic	
```
mosquitto_sub -h localhost -t “topic”
```

## Check open ports	
```
sudo netstat -nlp | grep mosquitto
```

## Start mosquitto service using config file	
```
sudo mosquitto -c /etc/mosquitto/mosquitto.conf
```

## Super user file manager
```
Gksudo pcmanfm
```

# General Linux Commands
## Make Script Executable
```
sudo chmod +x /path/to/filename.sh
```

## Update Node.js (may be wrong)
```
	curl https://www.npmjs.com/install.sh | sudo sh
```