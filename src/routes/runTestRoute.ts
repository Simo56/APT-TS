// routes/runTestRoute.ts
import { spawn } from 'child_process';
import { Router, Request, Response } from 'express';
import path = require('path');
import fs = require('fs');

const runTestRoute = Router();

runTestRoute.post('/run-scan', async (req: Request, res: Response) => {
    try {
        // Access data received from the '/' route
        const inputData = req.body; // Assuming the data is in the request body

        console.log(inputData);
        // Render the 'runTest.ejs' template and pass the data
        res.render('runTest.ejs', { inputData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Objects for the subprocesses
let scanSubprocess: {
    stdout: { on: (arg0: string, arg1: (data: any) => void) => void };
    stderr: { on: (arg0: string, arg1: (data: any) => void) => void };
    on: (arg0: string, arg1: (code: any) => void) => void;
} | null = null;
let exploitSubprocess: {
    stdout: { on: (arg0: string, arg1: (data: any) => void) => void };
    stderr: { on: (arg0: string, arg1: (data: any) => void) => void };
    on: (arg0: string, arg1: (code: any) => void) => void;
} | null = null;

runTestRoute.post('/start-scan', (req, res) => {
    // Create a subprocess to run the scan tool
    const target = req.body.target;
    console.log(target);
    const scanTool = req.body.scanningTool;
    console.log(scanTool);

    switch (scanTool) {
        case 'nmap':
            scanNmap(target);
            break;
        case 'openvas':
            break;
        default:
            scanNmap(target);
            break;
    }
});

const delimiter = '\n'; // Define your message delimiter

runTestRoute.get('/start-scan-stream', (req, res) => {
    try {
        // Set the appropriate response headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (!scanSubprocess) {
            console.log('SUBPROCESS NOT ACTIVE');
            res.status(400).json({ error: 'No active process' });
            return;
        }

        scanSubprocess.stdout.on('data', data => {
            const output = data.toString();
            const messages = output.split(delimiter); // Split the output into messages

            for (const message of messages) {
                if (message) {
                    // Ensure the message is not empty
                    res.write(`data: stdout: ${message}\n\n`);
                }
            }
        });

        scanSubprocess.stderr.on('data', data => {
            const error = `stderr: ${data.toString()}`;
            console.log(error);
            res.write(`data: ${error}\n\n`);
        });

        // Handle the subprocess exit event
        scanSubprocess.on('exit', code => {
            const exitMessage = `exit: ${code}`;
            res.write(`data: ${exitMessage}\n\n`);
            res.end();
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

export default runTestRoute;

function scanNmap(target: string) {
    const filePath = path.join(
        process.cwd(),
        'resultFilesFolder',
        'scanOutput',
        target + '.xml'
    );

    // Set up event listeners for the subprocess
    scanSubprocess = spawn('nmap', [
        '--script',
        'vulners,vulscan/vulscan',
        '-sV',
        target,
        '-oX',
        filePath,
        '-v',
        '--stats-every',
        '5s'
    ]);
}
