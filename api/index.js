import serverlesswp from 'serverlesswp';
import { validate } from '../util/install.js';
import { setup } from '../util/directory.js';

export const runtime = 'edge'; // 'nodejs' is the default

// This is where all requests to WordPress are routed through. See vercel.json or netlify.toml for the redirection rules.
export async function handler(event, context, callback) {
    // Move the /wp directory to /tmp/wp so that it is writeable.
    setup();

    // Send the request (event object) to the serverlesswp library. It includes the PHP server that allows WordPress to handle the request.
    let response = await serverlesswp({docRoot: '/tmp/wp', event: event});
    // Check to see if the database environment variables are in place.
    let checkInstall = validate(response);
    
    if (checkInstall) {
        return checkInstall;
    }
    else {
        // Return the response for serving.
        return response;
    }
}
