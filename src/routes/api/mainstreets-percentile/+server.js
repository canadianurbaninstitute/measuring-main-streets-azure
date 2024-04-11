// src/routes/api/mainstreets-measures/+server.js
import { supabase } from '../../lib/supabaseClient'; // Adjust the path as necessary

export async function GET({ url }) {
  // Extract the 'id' query parameter from the URL
  const id = url.searchParams.get('id');

  // Query the Supabase database for a row with the matching 'id'
  const { data, error } = await supabase
    .from('mainstreets-percentile')
    .select()
    .eq('id', id);

  // Check for errors
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Return the fetched data
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}