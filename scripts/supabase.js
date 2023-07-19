const createClient = require('@supabase/supabase-js').createClient;
const dotenv = require('dotenv');

//import { createClient } from '@supabase/supabase-js'
//import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE
const supabase = createClient(supabaseUrl, supabaseKey)

async function insertData() {
    const uniqueId = generateUniqueBigInt().toString()
    const createdAt = new Date().toISOString()
    const sessionName = 'Test Session'
    const transcriptText = 'This is a test transcript'

    try {
        const { data, error } = await supabase
        .from('transcripts')
        .insert([
            { id: uniqueId, created_at: createdAt, session_name: sessionName, transcript: transcriptText },
        ])
        .select()
        console.log(data, error)
    } catch (error) {
        console.log(error)
    }
}

function generateUniqueBigInt() {
    return BigInt(Date.now());
}

insertData()
