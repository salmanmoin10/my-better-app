const express = require('express');
const client = require('prom-client');
const app = express();
const PORT = 3000;

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label (service name) to all metrics
register.setDefaultLabels({
serviceName: 'my-app',
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a custom counter for total requests
const httpRequestCounter = new client.Counter({
name: 'http_requests_total',
help: 'Total number of HTTP requests',
labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestCounter);

// Main application route
app.get('/', (req, res) => {
res.send('Hello, World!');
// Increment the counter
httpRequestCounter.inc({ method: 'GET', route: '/', status_code: 200 });
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
try {
res.set('Content-Type', register.contentType);
res.end(await register.metrics());
} catch (err) {
res.status(500).end(err);
}
});

app.listen(PORT, () => {
console.log(`Server listening on port ${PORT}`);
});