import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://oobhmhdqjancbyfnwdul.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYmhtaGRxamFuY2J5Zm53ZHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTU0OTAsImV4cCI6MjA4NjIzMTQ5MH0.skWCWrV8fDs0Ikp9ORLasdAsTnTujcn6YVNKRqmEW4E";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
