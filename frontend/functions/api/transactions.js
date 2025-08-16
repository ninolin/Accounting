export async function onRequestGet({ env }) {
    const stmt = env.DB.prepare('SELECT * FROM transactions ORDER BY created_at DESC');
    const { results } = await stmt.all();
    
    return new Response(JSON.stringify(results), {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function onRequestPost({ request, env }) {
    const { description, amount, type } = await request.json();
    
    if (!description || !amount || !type) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    if (type !== 'income' && type !== 'expense') {
        return new Response(JSON.stringify({ error: 'Invalid type' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
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
        }
    });
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}