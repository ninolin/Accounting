export default {
    async fetch(request, env, ctx) {
        return await handleRequest(request, env);
    },
};

async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        if (path === '/api/transactions' && method === 'GET') {
            return await getTransactions(env, corsHeaders);
        }
        
        if (path === '/api/transactions' && method === 'POST') {
            return await createTransaction(request, env, corsHeaders);
        }

        return new Response('Not Found', { 
            status: 404, 
            headers: corsHeaders 
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
}

async function getTransactions(env, corsHeaders) {
    const stmt = env.DB.prepare('SELECT * FROM transactions ORDER BY created_at DESC');
    const { results } = await stmt.all();
    
    return new Response(JSON.stringify(results), {
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}

async function createTransaction(request, env, corsHeaders) {
    const { description, amount, type } = await request.json();
    
    if (!description || !amount || !type) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }

    if (type !== 'income' && type !== 'expense') {
        return new Response(JSON.stringify({ error: 'Invalid type' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    const stmt = env.DB.prepare(
        'INSERT INTO transactions (id, description, amount, type, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    
    await stmt.bind(id, description, amount, type, createdAt).run();
    
    const newTransaction = {
        id,
        description,
        amount,
        type,
        created_at: createdAt
    };
    
    return new Response(JSON.stringify(newTransaction), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}