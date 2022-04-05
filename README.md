# NodeJS Waiter

Simple NodeJS web server that servers an html loader while another nodejs application or else is starting. Once it detect the start it kills itself and redirects to the specified page.

Edit the `config.js` file to change the settings.

```bash
# Add service to systemctl, edit it with the correct paths
sudo cp node-waiter.service /etc/systemd/system

# Start service and check status
sudo systemctl start node-waiter.service
sudo systemctl status node-waiter.service

# Start on init
sudo systemctl enable node-waiter.service

# Check logs
sudo journalctl -u node-waiter.service
```
