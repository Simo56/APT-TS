import { spawn } from 'child_process';
import { Router, Request, Response } from 'express';
import path = require('path');

const gatherOSINTRoute = Router();

gatherOSINTRoute.get('/osint', async (req: Request, res: Response) => {
    try {
        res.render('osint.ejs');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Object for the subprocess for theHarvesting script
let activeSubprocess: {
    stdout: { on: (arg0: string, arg1: (data: any) => void) => void };
    stderr: { on: (arg0: string, arg1: (data: any) => void) => void };
    on: (arg0: string, arg1: (code: any) => void) => void;
} | null = null;

gatherOSINTRoute.post('/start-osint', (req, res) => {
    // Create a subprocess to run theHarvester
    const target = req.body.target;

    // Use a regular expression to sanitize the 'target' input
    if (!/^[a-zA-Z0-9_.-]+$/.test(target)) {
        return res.status(400).send("Invalid 'target' input.");
    }

    const resultFilesFolder = path.join(
        process.cwd(),
        'resultFilesFolder',
        'OSINT'
    );

    // Set up event listeners for the subprocess
    activeSubprocess = spawn('python', [
        '-u',
        'theHarvester/theHarvester.py',
        '-d',
        target,
        '-l',
        '500',
        '-b',
        'bing',
        '-f',
        resultFilesFolder + '/' + target
    ]);

    return;
});

const delimiter = '\n'; // Define your message delimiter

gatherOSINTRoute.get('/start-osint-stream', (req, res) => {
    try {
        // Set the appropriate response headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (!activeSubprocess) {
            console.log('SUBPROCESS NOT ACTIVE');
            res.status(400).json({ error: 'No active process' });
            return;
        }

        activeSubprocess.stdout.on('data', data => {
            const output = data.toString();
            const messages = output.split(delimiter); // Split the output into messages

            for (const message of messages) {
                if (message) {
                    // Ensure the message is not empty
                    res.write(`data: stdout: ${message}\n\n`);
                }
            }
        });

        activeSubprocess.stderr.on('data', data => {
            const error = `stderr: ${data.toString()}`;
            console.log(error);
            res.write(`data: ${error}\n\n`);
        });

        // Handle the subprocess exit event
        activeSubprocess.on('exit', code => {
            const exitMessage = `exit: ${code}`;
            res.write(`data: ${exitMessage}\n\n`);
            res.end();
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

export default gatherOSINTRoute;


