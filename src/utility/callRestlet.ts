const callRestlet = async (restletId: number, method: string, body?: unknown) => {
    try{
        const response = await fetch(`https://8232113.app.netsuite.com/app/site/hosting/restlet.nl?script=${restletId}&deploy=1`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        return await response.json();
    }
    catch(error){
        console.error('Error calling Restlet:', error);
        return null;
    }

}

export default callRestlet;