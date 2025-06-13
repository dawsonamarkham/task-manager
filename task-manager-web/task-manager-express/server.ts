import express, { Request, Response, RequestHandler, NextFunction } from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

// Define middleware to proxy to go server
const proxyMw: RequestHandler<Request, Response> = createProxyMiddleware({
   target: `${process.env['SERVER_HOST'] || 'http://localhost'}:3030`,
   changeOrigin: true
});

// Define app
const app = express();

// Add logger
app.use(morgan('tiny'));

// Define paths
app.use(express.static(path.join(__dirname, '../../task-manager-react/build')));

app.use('/auth', proxyMw);
app.use('/rest', proxyMw);

// Return formatted not found if resource does not exist
app.use((req: Request, res: Response, nxt: NextFunction) => {
    res.status(404).json({ message: 'Resource not found.'});
});

// Start application
app.listen(3000, () => {
   console.log('Node App listening on port 3000');
});