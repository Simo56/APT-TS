// extractCVEsFromXML.ts
const xml2js = require('xml2js');
const fs = require('fs');

export interface CVEData {
    port: string;
    serviceName: string;
    serviceVersion: string;
}

export function parseNmapXML(filePath: string): CVEData[] {
    let cveData: CVEData[] = [];
    try {
        const xmlData = fs.readFileSync(filePath, 'utf-8');
        const parser = new xml2js.Parser();


        parser.parseString(xmlData, (err: any, result: { nmaprun: { host: any; }; }) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return [];
            }

            // Traverse the XML structure to find the relevant data
            if (result.nmaprun.host && result.nmaprun) {
                const hosts = result.nmaprun.host;
                for (const host of hosts) {
                    const ports = host.ports[0].port;

                    for (const port of ports) {
                        const _port = port.$.portid;
                        const _serviceName = port.service[0].$.product;
                        const _serviceVersion = port.service[0].$.version;
                        if (_serviceName) {
                            const cve: CVEData = {
                                port: _port,
                                serviceName: _serviceName,
                                serviceVersion: _serviceVersion,
                            };
                            cveData.push(cve);
                        }
                    }
                }

            }
            return cveData;
        });
        return cveData;
    } catch (error) {
        console.log(error);
        return cveData;
    }
}