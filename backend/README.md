## Development

...

### Ngrok for Testing

For testing external webhooks and auth flows, use the ngrok script:

```bash
# Configure ngrok
./scripts/ngrok.sh config add-authtoken YOUR_TOKEN

# Start tunnel
./scripts/ngrok.sh http 5177
``` 