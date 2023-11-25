// routes/runTestRoute.ts
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Router, Request, Response } from 'express';
import path = require('path');
import fs = require('fs');
import { parseNmapXML, CVEData } from '../utils/extractCVEsFromXML';
import { promisify } from 'util';

const exec = promisify(require('child_process').exec);


const runTestRoute = Router();

runTestRoute.post('/run-scan', async (req: Request, res: Response) => {
    try {
        // Access data received from the '/' route
        const inputData = req.body; // Assuming the data is in the request body

        // Render the 'runTest.ejs' template and pass the data
        res.render('runTest.ejs', { inputData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Objects for the subprocesses
let scanSubprocess: ChildProcessWithoutNullStreams;

runTestRoute.post('/start-scan', (req, res) => {
    // Create a subprocess to run the scan tool
    const target = req.body.target;
    // Use a regular expression to sanitize the 'target' input
    if (!/^[a-zA-Z0-9_.-]+$/.test(target)) {
        return res.status(400).send("Invalid 'target' input.");
    }

    const scanTool = req.body.scanningTool;

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
    return;
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

let filePath: string;
function scanNmap(target: string) {
    filePath = path.join(
        process.cwd(),
        'resultFilesFolder',
        'scanOutput',
        target + '.xml'
    );

    scanSubprocess = spawn('nmap', [
        '-sV',
        target,
        '-oX',
        filePath,
        '--stats-every',
        '10s',
        '-v1'
    ]);
}

runTestRoute.post('/start-exploitation', async (req, res) => {
    // Create a subprocess to run the scan tool
    const target = req.body.target;
    // Use a regular expression to sanitize the 'target' input
    if (!/^[a-zA-Z0-9_.-]+$/.test(target)) {
        return res.status(400).send("Invalid 'target' input.");
    }

    const exploitTool = req.body.exploitationTool;

    let CVEArray;
    switch (exploitTool) {
        case 'metasploit':
            // Send the vulnerabilities array as a response
            CVEArray = await exploitMetasploit();
            res.json({ CVEArray });
            break;
        default:
            // Send the vulnerabilities array as a response
            CVEArray = await exploitMetasploit();
            res.json({ CVEArray });
            break;
    }
    return;
});


async function exploitMetasploit() {
    const listPossibleVulnerableServices = parseNmapXML(filePath);
    if (!listPossibleVulnerableServices) {
        console.error('No services to search for.');
        return { vulnerabilities: [] };
    }

    const metasploitCVEArray: { [key: string]: string } = {};

    listPossibleVulnerableServices.forEach(service => {
        const serviceName = `${service.serviceName} ${service.serviceVersion || ''}`;
        const searchCommand = `search name:'${serviceName}'`;
        const fullCommand = `msfconsole -q -x "${searchCommand}"`;

        metasploitCVEArray[serviceName] = fullCommand;
    });

    console.log("Content of Metasploit Commands:", metasploitCVEArray);
    return { vulnerabilities: metasploitCVEArray };
}




export default runTestRoute;
