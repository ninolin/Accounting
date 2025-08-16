export async function onRequestGet() {
    return new Response(JSON.stringify({ 
        message: 'Functions are working!',
        timestamp: new Date().toISOString()
    }), {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}