import { createClient } from "./src/lib/supabase/server";

async function testFetch() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campus_chronik")
    .select(`
      *,
      images:campus_chronik_images(*),
      comments:campus_chronik_comments(*)
    `)
    .order("year", { ascending: false });

  if (error) {
    console.log("Error object keys:", Object.keys(error));
    console.log("Error message:", error.message);
    console.log("Error details:", error.details);
    console.log("Error hint:", error.hint);
    console.log("Error code:", error.code);
  } else {
    console.log("Success! Data length:", data?.length);
  }
}

testFetch();
